import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of, switchMap } from 'rxjs';
import { Cliente } from 'src/app/models/Clientes';
import { ServicioTecnico } from 'src/app/models/ServicioTecnico';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { StService } from 'src/app/services/st.service';

@Component({
  selector: 'app-popup-info-client',
  templateUrl: './popup-info-client.component.html',
  styleUrls: ['./popup-info-client.component.css']
})
export class PopupInfoClientComponent implements OnInit {
  isMobile : boolean;
  countsIngresosSt : number = 0;
  form: FormGroup;
  botonApretado: boolean = false;
  isIngreso: boolean = false;
  isRevision: boolean = false;
  tieneDiagnostico: boolean = false;
  isDiagnosticando: boolean = false;
  diagnostico: any;
  user: any;
  fecha : any;
  


  constructor(
    public dialogRef: MatDialogRef<PopupInfoClientComponent>,
    private deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    private _clientService: ClientService,
    private _stService: StService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private afs: AngularFirestore,
    private _st: StService,
    private afAuth: AngularFireAuth,
    private _authService: AuthService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.form = this.fb.group({
      quiebre: [''],
      rayones: [''],
      neumaticoPinchado: [''],
      neumaticoEstable: [''],
      luzQuemada: [''],
      bocinaFuncional: [''],
      amortiguacionQuebrada: [''],
      displayQuemado: [''],
      motorFuncional: [''],
      cableadoCortado: [''],
      manillaresFrenos: [''],
      isFactura: [false],
      nChasis: [''],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    console.log(this.data)
    this.fecha = new Date();
    if(this.data.accion === 'ingresar'){
      this.isIngreso = true;
    }
    if(this.data.accion === 'revision'){
      this.isRevision = true;
    }
    if(this.data.datos.diagnostico != null){
      if(this.data.datos.diagnostico.length > 0){
        this.tieneDiagnostico = true;
      }
    }
    if(this.data.datos.estado === 'procesoDiagnostico'){
      this.isDiagnosticando = true;
    }
    const url = `https://app.relbase.cl/api/v1/clientes?query=${this.data.datos.datosCliente.rut}`;
    const headers = new HttpHeaders()
    .set('Authorization', 'NPYwMEmfdCATzYQzLNm9MJT4')
    .set('Company', '7c4VQC97YVhvHtK4ZYu4DbRq');
    this.http.get<any>(url, { headers }).subscribe((response) => {
      console.log(response)
      if(response.data.customers.length > 0){
        if(response.data.customers[0].id !== undefined){
          console.log(response)        
        }
      }
      },(error) => {
        console.log(error);
      }
    );
    this._stService.countDocuments().subscribe(documents => {
      console.log(documents)
      this.countsIngresosSt = documents.length+1;
    });


  }

  saveData(){
    if(this.botonApretado === false){
      this.botonApretado = true;
      const sub = this._clientService.getClientByRut(this.eliminarGuionesAgregarGuion(this.data.datos.datosCliente.rut)).subscribe((cliente)=>{
        sub.unsubscribe();
        if(cliente.length <= 0){
          //Si no exite el cliente creamos uno

          const url = `https://app.relbase.cl/api/v1/clientes?query=${this.eliminarGuionesAgregarGuion(this.data.datos.datosCliente.rut)}`;
          const headers = new HttpHeaders()
          .set('Authorization', 'NPYwMEmfdCATzYQzLNm9MJT4')
          .set('Company', '7c4VQC97YVhvHtK4ZYu4DbRq');
          this.http.get<any>(url, { headers }).subscribe((response) => {
            if(response.data.customers.length > 0) {

            //if(response.data.customers[0].id !== undefined){
              var password = '';
              const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * 62);
                const caracterAleatorio = caracteresPermitidos.charAt(randomIndex);
                password += caracterAleatorio;
              }
              var isEmpresa = false;
              if(response.data.customers[0].type_customer === 'company'){
                isEmpresa = true
              }
              const cliente: Cliente = {
                customerIdRelBase: response.data.customers[0].id,
                cantidadCompras: 0,
                datosPersonales: {
                  correo: this.data.datos.datosCliente.mail,
                  esEmpresa: isEmpresa,
                  nombre: this.data.datos.datosCliente.nombre,
                  pass: password,
                  rut: this.eliminarGuionesAgregarGuion(this.data.datos.datosCliente.rut),
                  telefono: this.data.datos.datosCliente.telefono
                },
                documentos: [],
                idFolios: []
              }
              this._clientService.addClient(cliente).then(()=>{
                //this.sendEmailCreateUser(this.data.datos.datosCliente.mail);
                this.toast.success('Usuario creado');
              },(error: any)=>{
                console.log(error);
              });
            
          }
        },(error) => {
              console.log(error);
            }
          );
        }
        this.saveIngreso();
      });
    }
  }


  saveIngreso(){

    const ST: ServicioTecnico = {
      datosCliente: this.data.datos.datosCliente,
      datosProducto: this.data.datos.datosProducto,
      documento: this.data.datos.documento,
      horaString: this.data.datos.horaString,
      nOrden: 'ST00'+this.countsIngresosSt,
      revisiones: {
        quiebre: this.form.value.quiebre,
        rayones: this.form.value.rayones,
        neumaticoPinchado: this.form.value.neumaticoPinchado,
        neumaticoEstable: this.form.value.neumaticoEstable,
        luzQuemada: this.form.value.luzQuemada,
        bocinaFuncional: this.form.value.bocinaFuncional,
        amortiguacionQuebrada: this.form.value.amortiguacionQuebrada,
        displayQuemado: this.form.value.displayQuemado,
        motorFuncional: this.form.value.motorFuncional,
        cableadoCortado: this.form.value.cableadoCortado,
        manillaresFrenos: this.form.value.manillaresFrenos,
        isFactura: this.form.value.isFactura,
        nChasis: this.form.value.nChasis
      },
      estado: 'ingresado',
      diagnostico: '',
      fecha: new Date(),
      fechaString: new Date().getDay().toString()+"."+new Date().getMonth().toString()+"."+new Date().getFullYear().toString(),
      mesAnio: (new Date().getMonth()+1).toString()+"/"+new Date().getFullYear().toString(),
      comentario: this.form.value.comentario
    }



    this._clientService.saveIngresoSt(ST).then((docRef: any)=>{
      this.sendEmailIngreso(ST.datosCliente.mail, docRef.id, this.data.datos.datosCliente);
      this.toast.success('Datos guardados');
      this.dialogRef.close();
    },
    (error: any) => {
      this.toast.error('Opps... ocurrio un error', 'Error');
      console.log(error);
    });
  



    

  }

  llenarInput(controlName: string, event: any){
    if(event.target.checked === true){
      this.form.get(controlName)?.setValue('Verdadero');    
    }else{
      this.form.get(controlName)?.setValue('Falso');    
    }
  }

  sendEmailIngreso(mail:string, id: any, datosCliente : any){
    
    const htmlmail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, "helvetica neue", helvetica, sans-serif"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>Nuevo mensaje</title><!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">#outlook a {	padding:0;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}[data-ogsb] .es-button {	border-width:0!important;	padding:10px 20px 10px 20px!important;}.es-button-border:hover a.es-button, .es-button-border:hover button.es-button {	background:#56d66b!important;	border-color:#56d66b!important;}.es-button-border:hover {	border-color:#42d159 #42d159 #42d159 #42d159!important;	background:#56d66b!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .h-auto { height:auto!important } }</style></head> <body style="width:100%;font-family:arial, "helvetica neue", helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#F6F6F6"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6"><tr><td valign="top" style="padding:0;Margin:0"><table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" bgcolor="#020202" style="padding:20px;Margin:0;background-color:#020202;border-radius:0px 0px 25px 25px"><table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://yfnqcp.stripocdn.email/content/guids/CABINET_d2ddaac418c83836fc8f3ac5b599e6cc/images/munsalg.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="190"></td> </tr></table></td></tr></table></td></tr></table></td> </tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td align="center" style="padding:0;Margin:0"><table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;padding-bottom:40px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>' +
    '<td align="left" style="padding:0;Margin:0"><h2>¡Anunciamos el lanzamiento de Munsac Ayuda!</h2><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, "helvetica neue", helvetica, sans-serif;line-height:29px;color:#333333;font-size:19px">Estimado/a '+datosCliente.nombre+',</p><p>Te notificamos que hemos recibido tu scooter en Servicio técnico en Munsac. A continuación, adjuntamos el código único que podrás utilizar en nuestro sistema de Munsac Ayuda > Opción "Quiero saber de mi scooter en servicio técnico" para verificar el estado de tu scooter en nuestro Servicio Técnico: </p><p>Código único:<strong>'+id+'</strong></p><p>¡Esperamos verte pronto en nuestro servicio técnico!</p><p>Gracias por ser parte de la familia Munsac.</p><p>Saludos cordiales,</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, "helvetica neue", helvetica, sans-serif;line-height:21px;color:#ffffff;font-size:14px">De parte del equipo Munsac, te deseamos un buen viaje! <strong><u>Con amor, por Munsac.</u></strong></p></td>' +
    '</tr></table></td></tr></table></td></tr></table></td> </tr></table><table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;color:white!important;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center" style="padding:0;Margin:0"><table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" bgcolor="#0c0a0a" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#0c0a0a;border-radius:25px 25px 0px 0px"><table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" bgcolor="#160302" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#160302" role="presentation"><tr><td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, "helvetica neue", helvetica, sans-serif;line-height:21px;color:white!important;font-size:14px">Munsac 2023. Todos los derechos reservados.</p> </td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>';

    this.afs.collection('Correos').add({
      to: mail,
      message: {
        subject: 'Su scooter ha sido ingresado a servicio técnico',
        html: htmlmail
      },
    }).then(() => console.log('Send email for delivery!'));
  }

  sendEmailCreateUser(mail:string){
    this.afs.collection('Correos').add({
      to: mail,
      message: {
        subject: 'Su scooter ha sido ingresado',
        html: '<p>BIenvenido a Munsac</p>'
      },
    }).then(() => console.log('Send email for delivery!'));
  }

  addDiagnosis(){
    this.afAuth.onAuthStateChanged((user) => {
      const sub = this._authService.getUserByEmailWithId(user!.email, 'correo').subscribe((user)=> {
        sub.unsubscribe();
        this.user = user[0].payload.doc;
        var id = this.data.id;
        if(this.diagnostico !== undefined){
          const cambios = {
            diagnostico: this.diagnostico,
            estado: 'pendientePresupuesto',
            idTecnico: this.user.id,
            'idTecnico.pendientePresupuesto': this.user.id,
            'fechas.pendientePresupuesto': this.datePipe.transform(this.fecha, 'dd/MM/yyyy HH:mm')
          }
          this._st.updateScheduleSt(id, cambios).then(()=>{
            this.toast.success('Diagnostico añadido');
            this.dialogRef.close();
          },(error: any) => {
            console.log(error);
            this.toast.error('Opps... ocurrio un error', 'Error');
          })
        }else{
          this.toast.info('El diagnostico es requerido')
        }
      });    
    });
  }

  eliminarGuionesAgregarGuion(str: string): string {
    const strSinGuiones = str.replace(/-/g, ''); // Elimina todos los guiones
    const nuevoString = strSinGuiones.slice(0, -1) + '-' + strSinGuiones.slice(-1); // Agrega un guion antes del último carácter
    return nuevoString;
  }

  statusEnDiagnostico(){

    this.afAuth.onAuthStateChanged((user) => {
      const sub = this._authService.getUserByEmailWithId(user!.email, 'correo').subscribe((user)=> {
        sub.unsubscribe();
        this.user = user[0].payload.doc;
        var id = this.data.id;
        const cambios = {
          estado: 'procesoDiagnostico',
          'idTecnico.inicioDiagnostico': this.user.id,
          'fechas.inicioDiagnostico': this.datePipe.transform(this.fecha, 'dd/MM/yyyy HH:mm')
        }
        this._st.updateScheduleSt(id, cambios).then(()=>{
          this.toast.success('Proceso de diagnostico iniciado');
          this.isDiagnosticando = true;
        },(error: any) => {
          console.log(error);
          this.toast.error('Opps... ocurrio un error', 'Error');
        })
      });    
    });
  }


}

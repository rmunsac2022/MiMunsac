import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-popup-client-detail',
  templateUrl: './popup-client-detail.component.html',
  styleUrls: ['./popup-client-detail.component.css']
})
export class PopupClientDetailComponent implements OnInit {
  amount: number = 0;
  listProducts: any[] = [];
  listFolios: string[] = [];
  httpOptions: any;
  loading: boolean = true;
  formDocument: FormGroup;
  typePaymentId: number = 0;
  idDoc: any;
  isClicked: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    public dialogRef: MatDialogRef<PopupClientDetailComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    private _clientService: ClientService,
    private toast: ToastrService
  ) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: "NPYwMEmfdCATzYQzLNm9MJT4",
        Company: "7c4VQC97YVhvHtK4ZYu4DbRq",
      })
    };
    this.formDocument = this.fb.group({
      correo: ['', Validators.required],
      telefono: ['', Validators.required],
      nroSerie: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      rutEmpresa: ['', Validators.required],
      razonSocial: ['', Validators.required],
      direccionEmpresa: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log(this.data)
    const promises = this.data.documents.map((element: any) => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(`https://app.relbase.cl/api/v1/dtes/${element}`, this.httpOptions).subscribe({
          next: (document: any) => {
            this.listFolios.push(document.data.folio.toString());
            this.typePaymentId = document.data.type_payment_id;
            this.amount += document.data.amount_total;
            document.data.products.forEach((product: any) => {
              this.listProducts.push(product);
            });
            const correoEncontrado = document.data.comment.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
            const telefonoEncontrado = document.data.comment.match(/\b(?:\+?(\d{2}))?(\d{9})\b/);
            if (telefonoEncontrado !== undefined) {
              this.data.telefono = telefonoEncontrado ? `+${telefonoEncontrado[1] || '56'} ${telefonoEncontrado[2]}` : null;
            }
            if (correoEncontrado !== undefined) {
              this.data.correo = correoEncontrado ? correoEncontrado[0] : null;
            }
            resolve();
          },error:(error) => {
            reject(error);
          }
        });
      });
    });
  
    Promise.all(promises).then(() => {
      this.formDocument.get('correo')?.setValue(this.data.correo);
      this.formDocument.get('telefono')?.setValue(this.data.telefono);
      this.loading = false;
    }).catch((error) => {
      console.error(error);
      this.loading = false;
    });
  }
  
  formatNumber(valor: any) {
    const formato = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
    return formato.format(valor);
  }

  changeValidators(){
    const rutEmpresaControl = this.formDocument.get('rutEmpresa');
    const razonSocialControl = this.formDocument.get('razonSocial');
    const direccionEmpresaControl = this.formDocument.get('direccionEmpresa');
    if(this.formDocument.value.tipoDocumento === 'Factura'){
      rutEmpresaControl!.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(10)]);
      razonSocialControl!.setValidators([Validators.required, Validators.minLength(3)]);
      direccionEmpresaControl!.setValidators([Validators.required, Validators.minLength(3)]);
    }else{
      rutEmpresaControl!.clearValidators();
      razonSocialControl!.clearValidators();
      direccionEmpresaControl!.clearValidators();
      rutEmpresaControl!.setValue('');
      razonSocialControl!.setValue('');
      direccionEmpresaControl!.setValue('');
    }
    rutEmpresaControl!.updateValueAndValidity();
    razonSocialControl!.updateValueAndValidity();
    direccionEmpresaControl!.updateValueAndValidity();
  }

  setNameByRutCompany(){
    this.formDocument.get('rutEmpresa')?.setValue(this.formDocument.value.rutEmpresa.toUpperCase());
    const url = "https://api.libreapi.cl/rut/activities?rut="+this.formDocument.value.rutEmpresa;
    this.http.get(url).subscribe({
      next: (response: any)=>{
        this.formDocument.get('razonSocial')?.setValue(response.data.name);
      },error: (error) => {
        console.log(error);
      }
    });
  }
  
  generateDocument(){
    this.loading = true;
    const body: any = {
      "type_document": 0,
      "start_date": new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear(),
      "end_date": new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear(),
      "customer_id": this.data.id,
      "comment": '',
      "products": [],
      "address": this.data.address,
      "seller_id": 29002,
      "ware_house_id": 248,
      "type_payment_id": this.typePaymentId
    }
    if(this.formDocument.value.tipoDocumento === 'Boleta'){
      body.type_document = 39;
      body.comment = 'COMPRA EN MODALIDAD PREVENTA\nTelefono/Correo: '+this.formDocument.value.telefono+' / '+this.formDocument.value.correo+'\nDirección: '+this.data.address;
      body.products = this.listProducts.map(object => {
        return {
          "product_id": object.product_id,
          "price": Math.round(object.price*1.19),
          "quantity": object.quantity,
          "tax_affected": object.tax_affected,
          "unit_item": "UNID"
        };
      });
    }
    if(this.formDocument.value.tipoDocumento === 'Factura'){
      body.type_document = 33;
      body.comment = 'COMPRA EN MODALIDAD PREVENTA\nTelefono/Correo: '+this.formDocument.value.telefono+' / '+this.formDocument.value.correo+'\nDirección: '+this.data.address;
      body.products = this.listProducts.map(object => {
        return {
          "product_id": object.product_id,
          "price": object.price,
          "quantity": object.quantity,
          "tax_affected": object.tax_affected
        };
      });
    }
    this.http.post(`https://app.relbase.cl/api/v1/dtes/`,body,this.httpOptions).subscribe({
      next: (response: any) => {
        this.idDoc = response.data.id;
        const promiseEmail = this.sendEmail(response.data.id);
        const promiseUpdate = this.updateListFolios();
        const promiseDocDB = this.addNewDocumentDB();
        Promise.all([promiseEmail, promiseUpdate, promiseDocDB]).then(() => {
          this.dialogRef.close({event: 'close', data: 'withChanges'});
          this.toast.success('Documento enviado');
        }).catch((error) => {
          console.error(error);
        });
      },error: (error) => {
        console.log(error);
      }
    });
  }

  sendEmail(id: any): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      const bodyEmail = {
        email: this.formDocument.value.correo
      }
      this.http.post(`https://app.relbase.cl/api/v1/dtes/${id}/enviar-email`,bodyEmail,this.httpOptions).subscribe({
        next: (response: any) => {
          resolve(response);
        },error: (error) => {
          reject(error);
        }
      });
    });
  }

  updateListFolios(): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      const sub = this._clientService.getFolios().subscribe({
        next: (data) => {
          sub.unsubscribe();
          var folios = data.folios.split('.');
          folios = folios.filter((item: string) => !this.listFolios.includes(item));
          data.folios = folios.join('.');
          this._clientService.updateFolios(data).then((response) => {
            resolve(response);
          },(error) => {
            reject(error);
          });
        },error: (error) => {
          reject(error);
        }
      });
    });
  }

  addNewDocumentDB(): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      const DOC = {
        date: new Date(),
        customer_id: this.data.id,
        address: this.data.address,
        email: this.formDocument.value.correo,
        telefono: this.formDocument.value.telefono,
        folios: this.listFolios,
        nombre: this.data.name,
        rut: this.data.rut,
        tipoDocumento: this.formDocument.value.tipoDocumento.toLowerCase(),
        nroSerieProdutos: this.formDocument.value.nroSerie,
        idDoc: this.idDoc
      }
      this._clientService.addNewDocument(DOC).then((reponse) => {
        resolve(reponse);
      },(error) => {
        reject(error);
      });
    });

  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ClientService } from 'src/app/services/client.service';
import { PopupClientDetailComponent } from '../popup-client-detail/popup-client-detail.component';

@Component({
  selector: 'app-popup-clients-by-folio',
  templateUrl: './popup-clients-by-folio.component.html',
  styleUrls: ['./popup-clients-by-folio.component.css']
})
export class PopupClientsByFolioComponent implements OnInit {
  listFolios: string[] = [];
  httpOptions: any;
  listClients: any[] = [];
  listClientsFilter: any[] = [];
  loading: boolean = true;
  changeList: boolean = false;
  isMobile : boolean;
  valueToSearch: string = '';

  constructor(
    private _clientService: ClientService,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PopupClientsByFolioComponent>
  ) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: "NPYwMEmfdCATzYQzLNm9MJT4",
        Company: "7c4VQC97YVhvHtK4ZYu4DbRq",
      })
    };
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    const sub = this._clientService.getFolios().subscribe((data) => {
      sub.unsubscribe();
      this.listFolios = data.folios.split('.');
      this.getDocuments();
    });
  }

  getDocuments() {  
    const promises = this.listFolios.map(element => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(`https://app.relbase.cl/api/v1/dtes?type_document=52&query=${element}`, this.httpOptions).subscribe({
          next: (response: any) => {
            response.data.dtes.forEach((document: any) => {
              if (document.folio.toString() === element) {
                this.http.get(`https://app.relbase.cl/api/v1/clientes/${document.customer_id}`, this.httpOptions).subscribe({
                  next: (client: any) => {
                    const index = this.listClients.findIndex((elementClient) => elementClient.id === client.data.id);
                    if (index === -1) {
                      client.data.documents = [document.id];
                      this.listClients.push(client.data);
                    } else {
                      this.listClients[index].documents.push(document.id);
                    }
                    resolve();
                  },error: (error) => {
                    reject(error);
                  }
                });
              }
            });
          },error: (error) => {
            reject(error);
          }
        });
      });
    });

    Promise.all(promises).then(() => {
      this.listClients.sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  viewClientByIdRelBase(client: any){
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      data: client,
      maxWidth:  this.isMobile ? '90dvw' : '50vw',
      minWidth: this.isMobile ? '90dvw' : 'auto',
      maxHeight: this.isMobile ? '70dvh' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.event === 'close'){
        if(result.data === 'withChanges'){
          this.dialogRef.close();
        }
      }
    });
  }

  searchSale() {
    if (this.valueToSearch !== '') {
      this.changeList = true;
      const searchKeywords = this.valueToSearch.toUpperCase().split(' ');
      this.listClientsFilter = this.listClients.filter(cliente =>
        searchKeywords.every(keyword =>
          cliente.name.toUpperCase().includes(keyword) || cliente.rut.includes(keyword)
        )
      );
    } else {
      this.changeList = false;
    }
  }

  checkSearch(){
    if(this.valueToSearch === ''){
      this.changeList = false;
    }
  }
}

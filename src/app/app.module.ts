import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from "@angular/forms";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { LottieModule } from 'ngx-lottie';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HistoryComponent } from './pages/history/history.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { HoursExtraComponent } from './pages/hours-extra/hours-extra.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PopupCreateReportComponent } from './components/popup-create-report/popup-create-report.component';
import { PopupTickQrComponent } from './components/popup-tick-qr/popup-tick-qr.component';
import { PopupCreateRequestComponent } from './components/popup-create-request/popup-create-request.component';
import { PopupAddHourexComponent } from './components/popup-add-hourex/popup-add-hourex.component';
import { RequestPermitsComponent } from './components/request-permits/request-permits.component';
import player from 'lottie-web';
import { PopupActionSuccessComponent } from './components/popup-action-success/popup-action-success.component';
import { PopupDetailRequestComponent } from './components/popup-detail-request/popup-detail-request.component';
import { PopupInfoClientComponent } from './components/munsacAyuda/popup-info-client/popup-info-client.component';
import { PopupShortcutsComponent } from './components/popup-shortcuts/popup-shortcuts.component';
import { PopupClientsByFolioComponent } from './components/popup-clients-by-folio/popup-clients-by-folio.component';
import { PopupClientDetailComponent } from './components/popup-client-detail/popup-client-detail.component';

export function playerFactory() {
  return player;
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    HistoryComponent,
    ReportsComponent,
    RequestsComponent,
    HoursExtraComponent,
    MenuComponent,
    LoginComponent,
    SpinnerComponent,
    PopupCreateReportComponent,
    PopupTickQrComponent,
    PopupCreateRequestComponent,
    PopupAddHourexComponent,
    RequestPermitsComponent,
    PopupActionSuccessComponent,
    PopupDetailRequestComponent,
    PopupInfoClientComponent,
    PopupShortcutsComponent,
    PopupClientsByFolioComponent,
    PopupClientDetailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxScannerQrcodeModule,
    BrowserAnimationsModule,
    LottieModule.forRoot({ player: playerFactory }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ToastrModule.forRoot({
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right'
    }),
    MatDialogModule,
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    PickerModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

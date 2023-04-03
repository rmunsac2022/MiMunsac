import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from "@angular/forms";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxEmojiPickerModule } from  'ngx-emoji-picker';
import { MatDialogModule } from '@angular/material/dialog';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { LottieModule } from 'ngx-lottie';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';


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
import * as lottie from 'lottie-web';

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxScannerQrcodeModule,
    BrowserAnimationsModule,
    QRCodeModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgxEmojiPickerModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right'
    }),
    MatDialogModule,
    provideStorage(() => getStorage()),
    PickerModule,
    provideAuth(() => getAuth())
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

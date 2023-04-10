import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { HoursExtraComponent } from './pages/hours-extra/hours-extra.component';
import { HistoryComponent } from './pages/history/history.component';
import { LoginComponent } from './pages/login/login.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RequestPermitsComponent } from './components/request-permits/request-permits.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: 'home', component: HomeComponent},  
  { path: 'login', component: LoginComponent},
  { path: 'reports', component: ReportsComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'requests', component: RequestsComponent},
  { path: 'history', component: HistoryComponent},
  { path: 'hoursExtra', component: HoursExtraComponent},
  { path: 'permits', component: RequestPermitsComponent},
  { path: '**', redirectTo: 'login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionRequestService {

  constructor(
    private router: Router,
  ) { }

  async confirmPermitions(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/home']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }

  async confirmPermitionsHourExtra(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/hoursExtra']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }

  async confirmPermitionsProfile(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/profile']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }

  async confirmPermitionsReport(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/reports']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }



  async confirmPermitionsRequest(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/requests']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }

  async confirmPermitionsHistory(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/history']); 
    } else {
      this.router.navigate(['/permits']);
    }
  }
}

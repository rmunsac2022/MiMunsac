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
      console.log('Permission granted')
    } else {
      navigator.geolocation.getCurrentPosition((position)=>{
      });
      navigator.mediaDevices.getUserMedia({video: true})
      .then( (stream) => {
      })
      if(locationPerm.state === 'denied' && cameraPerm.state === 'denied'){
        this.router.navigate(['/permits']);
      }
    }
  }

  async confirmPermitionsToHome(){
    const locationPerm = await navigator.permissions.query({ name: 'geolocation' });
    const cameraPerm = await navigator.permissions.query({ name: 'camera' as PermissionName});
    
    if (locationPerm.state === 'granted' && cameraPerm.state === 'granted') {
      this.router.navigate(['/home']);
    }else{
      this.router.navigate(['/permits']);
    }
  }
}

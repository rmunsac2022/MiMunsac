import { Component, OnInit } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PermissionRequestService } from 'src/app/services/permission-request.service';

@Component({
  selector: 'app-request-permits',
  templateUrl: './request-permits.component.html',
  styleUrls: ['./request-permits.component.css'],
  template: `
    <ng-lottie [options]="options" (animationCreated)="animationCreated($event)"></ng-lottie>
  `
})



export class RequestPermitsComponent implements OnInit {

  isStart = false;
  index = 0;

  
  options: AnimationOptions = {
    path: './assets/animations/question.json',
  };
  optionsubication: AnimationOptions = {
    path: './assets/animations/location.json',
  };

  optionscamera: AnimationOptions = {
    path: './assets/animations/camera.json',
  };

  optionsready: AnimationOptions = {
    path: './assets/animations/ready.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  
  constructor(
    public router: Router,
    private afAuth: AngularFireAuth,
    private permissionService: PermissionRequestService
    ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if(user){
        this.permissionService.confirmPermitions();
      }
    });
  }


  start() {
    this.isStart = true;
    this.index++;
     console.log(this.index);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.index++;
        console.log(this.index)

        if((latitude).toString.length > 1) {
          if((longitude).toString.length > 1) {
            this.index++;
          }
        }
      });
    } else {
      console.log("No support for geolocation")
    }
  }

  getCamera() {
    navigator.mediaDevices.getUserMedia({video: true})
    .then( (stream) => {
          if (stream.getVideoTracks().length > 0){
            this.index++;
          }
    })
  }


}

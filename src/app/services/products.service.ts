import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  constructor(
    private http: HttpClient) 
    { }
    
 

}

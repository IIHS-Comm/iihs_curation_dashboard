import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Varglobal provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Global {

   boards:any=[];
   categoryfeeds:any=[];
   categoryupdated:any=[];
   boardfilter:any = 0;
  constructor(public http: Http) {
  


  }

}
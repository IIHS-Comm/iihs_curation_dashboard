import { Injectable,ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import superlogin from 'superlogin-client';
import PouchDB from 'pouchdb';
import {Settings} from './settings'
declare function emit(key: any,value:any): void;
@Injectable()
export class Userservice {  
  db:any;
  remote:any;
  username:any;
  password:any;
  user:any;
//userservicedomain:any='http://192.168.1.15:3001';
//userserviceendpoints:any={register:'/auth/register',login:'/auth/login'}

constructor(private http: Http,private settings:Settings) {

  //this.db = new PouchDB('userdb');
 
  let url = localStorage.getItem('url');
  console.log("url",url);

  
       

//Configurations for user registration and login
   var config:any = {
      serverUrl: this.settings.superloginserverUrl,
      // The base URL for the SuperLogin routes with leading and trailing slashes (defaults to '/auth/')
      baseUrl: '/auth/',
      // A list of API endpoints to automatically add the Authorization header to
      // By default the host the browser is pointed to will be added automatically
      endpoints: ['api.example.com'],
      // Set this to true if you do not want the URL bar host automatically added to the list
      noDefaultEndpoint: false,
      // Where to save your session token: localStorage ('local') or sessionStorage ('session'), default: 'local'
      storage: 'local',
      // The authentication providers that are supported by your SuperLogin host
      providers: ['facebook', 'twitter'],
      // Sets when to check if the session is expired. 'stateChange', 'startup' or nothing.
      // 'stateChange' checks every time $stateChangeStart or $routeChangeStart is fired
      // 'startup' checks just on app startup. If this is blank it will never check.
      checkExpired: 'startup',
      // A float that determines the percentage of a session duration, after which SuperLogin will automatically refresh the
      // token. For example if a token was issued at 1pm and expires at 2pm, and the threshold is 0.5, the token will
      // automatically refresh after 1:30pm. When authenticated, the token expiration is automatically checked on every
      // request. You can do this manually by calling superlogin.checkRefresh(). Default: 0.5
      refreshThreshold: 0.5
    };

    superlogin.configure(config);

    this.user = localStorage.getItem("name");
  


  }
public resetPassword(token,pwd){


  let doc = {
    token: token,
   password:pwd,
    confirmPassword:pwd
  };

  return new Promise(resolve => {
    superlogin.resetPassword(doc).then(function(response) {
      console.log("asd", response);
      resolve(response );
      },(err)=>{
         console.log(err);
        resolve(err);
      });
    });

}
public onforget(email)
{
  
return new Promise(resolve => {
    superlogin.forgotPassword(email).then(function (response) {
    console.log("asd", response);
    resolve(response );
    },(err)=>{
       console.log(err);
      resolve(err);
    });
  });
}

public adduser(user){
	//console.log("usr",user);
  return new Promise(resolve => {
    superlogin.register(user).then(function (response) {
      
    resolve(response);
    },(err)=>{
      console.log(err);
      resolve(err);
    });
  });
  
   
   
}
public sendConfirmEmail(email,groupname,type,regOrlogin)
{
  var status;
  //console.log("Called to msg");
   return new Promise(resolve => {
     var emailurl = this.settings.superloginserverUrl+'/sendemail?email='+email+'&groupname='+groupname+'&type='+type+'&regOrlogin='+regOrlogin;
       //console.log(newsrack);
   this.http.get(emailurl).subscribe((response) => {
     console.log("sd",response.ok);
     status = response.ok;
      
     resolve(status);  
        });
    });
     
    
 
}
public validateEmail(email){
  return new Promise(resolve => { 
    superlogin.validateEmail(email).then(res=>{
      console.log(res);
      resolve(res);
    },(err)=>{
      resolve(err);
      console.log(err);
    })
  });
}
public login(credentials){

return new Promise(resolve => { 
  superlogin.login(credentials).then((response)=>{
    console.log(response);
    resolve(response);
  },(err)=>{
   resolve(err);
    console.log(err);
  });
});

}
getUserSubscriptions(){
  let url = localStorage.getItem('url');
  //console.log("url",url);

// let url = 'http://localhost:5984/supertest$vinutha/_all_docs?include_docs=true'
  
  let headers = new Headers();
  headers.append( 'Content-Type', 'application/json')
  headers.append('Authorization', 'Basic '+btoa(this.settings.couchdbusername+':'+this.settings.couchdbpassword)); // ... Set content type to JSON
  let options = new RequestOptions({ headers: headers });
  console.log("auth",options);
  return new Promise(resolve => {
        this.http.get(url+'/_all_docs?include_docs=true',options).map(res=>res.json()).subscribe((response)=> {
          console.log(response)
          resolve(response.rows);
        }, (err) => {
          console.log("er",err);
        }); 

  });

}
getemail(){
  var url = this.settings.protocol+this.settings.dbusers+'/_design/auth/_view/email';
   //console.log(url);
  return new Promise(resolve => {
        this.http.get(url).map(res=>res.json()).subscribe((response)=> {
          
          //console.log("users",response);
          resolve(response.rows);
        }, (err) => {
          console.log(err);
        }); 

  });
}
getusers(){
  var url = this.settings.protocol+this.settings.dbusers+'/_all_docs';
   //console.log(url);
  return new Promise(resolve => {
        this.http.get(url).map(res=>res.json()).subscribe((response)=> {
          
          //console.log("users",response);
          resolve(response.rows);
        }, (err) => {
          console.log(err);
        }); 

  });


}
getAuser(user){
  var url = this.settings.protocol+this.settings.dbusers+'/'+user;
   //console.log(url);
  return new Promise(resolve => {
        this.http.get(url).map(res=>res.json()).subscribe((response)=> {
          
          //console.log("users",response);
          resolve(response);
        }, (err) => {
          console.log(err);
        }); 

  });


}
updateAuser(user){
  //console.log(user)
  var url = this.settings.protocol+this.settings.dbusers+'/'+user._id;
 // console.log(url)
  let headers = new Headers();
   headers.append( 'Content-Type', 'application/json')
   headers.append('Authorization', 'Basic '+btoa(this.settings.couchdbusername+':'+this.settings.couchdbpassword)); // ... Set content type to JSON
  let options = new RequestOptions({ headers: headers });
    
        this.http.put(url,user,options).map(res=>res.json()).subscribe((response)=> {
          
          console.log("user",response);
         // resolve(response.rows);
        }, (err) => {
          console.log(err);
        }); 

}
pullnewFeeds(doc){
  
  doc.metadata.map(url=>{
    //console.log(doc);
    var newsrack = this.settings.feedparserUrl+'/?url='+url.link+'&feedname='+doc.feedname;
    //console.log(newsrack);
    this.http.get(newsrack).subscribe((response)=> {
      console.log("va;",response);
    })
  })
  
}
 
checkExpired(){
 
 //console.log(superlogin.getSession());
  
  if(superlogin.getSession() === null){
    //superlogin.refresh();  
    
    //localStorage.removeItem('isLoggedin');
  }

}
logout(){
  superlogin.logout('message').then(res=>{
    console.log(res);
  })
}




}
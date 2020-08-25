import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  isSignedIn = false;
  loggedInUserId
  loggedInEmail

  constructor(public router:Router, public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe(res=>{
      if(res.uid){
        this.loggedInUserId = res.uid
        this.loggedInEmail = res.email
        this.isSignedIn = true
        this.router.navigateByUrl("/home")
      }
      else{
        this.isSignedIn = false
      }
    })
  }

  signInAuth(email, password){

    this.afAuth.signInWithEmailAndPassword(email, password).then(res=>{
      this.isSignedIn = true
      this.loggedInUserId  = res.user.uid
      this.loggedInEmail = email
      this.router.navigateByUrl("/home")


    })

    .catch(res=>{
      alert("Invalid Email Id or Password")
      this.isSignedIn = false
      this.router.navigateByUrl("/signin")
    })

    .finally();{
      return this.isSignedIn
    }
  }

  LogoutAuth(){
    this.isSignedIn = false
    this.afAuth.signOut()
    location.reload()
    this.router.navigateByUrl("/signin")
  }

  isUserSignedIn(){
    return this.isSignedIn
  }

  signUpAuth(email, password){
    this.afAuth.createUserWithEmailAndPassword(email, password).then(res=>{
      this.isSignedIn = true
      this.loggedInUserId  = res.user.uid
      this.loggedInEmail = email
      this.router.navigateByUrl("/home")
    }).catch(err=>{
      alert(err)
    })
  }

  getUserId(){
    return this.loggedInUserId
  }

  getUserEmail(){
    return this.loggedInEmail
  }


}

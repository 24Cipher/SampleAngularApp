import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PrototypeService } from './services/prototype.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  isSignedIn = false;
  loggedInUserId
  loggedInEmail

  constructor(public router: Router, public afAuth: AngularFireAuth, public firestore: AngularFirestore) {
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

  readUserDetails(){
    debugger;
    if(this.isSignedIn){
      var user = this.firestore.collection("User", ref=>ref.where('email', '==', this.getUserEmail()))
      user.snapshotChanges().pipe(
                                  map(actions => actions.map(a => {
                                    const data = a.payload.doc.data() as any  
                                    return data
                                    }))
                                ).subscribe(res=>{
                                  const userData = res;
                                  this.writeAccounts(userData[0].name, userData[0].phone);
                                })
    }
  }
  writeAccounts(username, phone){
    const ref = this.firestore.collection('accounts');
    ref.add({
              name  : username,
              uid   : this.getUserId(),
              email : this.getUserEmail(),
              phn   : phone
    });
  }

  signUpAuth(email, password, user){
    this.afAuth.createUserWithEmailAndPassword(email, password).then(res=>{
      this.firestore.collection('User').add(user);
      this.isSignedIn = true
      this.loggedInUserId  = res.user.uid
      this.loggedInEmail = email
      this.readUserDetails();
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

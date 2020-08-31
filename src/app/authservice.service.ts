import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PrototypeService } from './services/prototype.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/services/user';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  isSignedIn = false;
  loggedInUserId: any;
  loggedInEmail: any;
  userData: any; // Save logged in user data

  constructor(public router: Router, public afAuth: AngularFireAuth, public firestore: AngularFirestore,  public ngZone: NgZone ) {
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
    });

    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  signInAuth(email, password){

    this.afAuth.signInWithEmailAndPassword(email, password).then(res=>{
      // this.SetUserData(res.user);
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
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['signin']);
    });
    // location.reload()
    // this.router.navigateByUrl("/signin")
  }

  isUserSignedIn(){
    return this.isSignedIn
  }

  readUserDetails(){
    // debugger;
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
      // this.SetUserData(res.user);
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


   /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

}

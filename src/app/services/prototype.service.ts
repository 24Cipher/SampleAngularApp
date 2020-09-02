import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthserviceService } from '../authservice.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrototypeService {

  userEmail = ''
  initialSubs = ['math','science','cs']
  subjectIDs = []
  // contentVal = []
  cname = ['abc','xyz','pqr']
  ctype = ['abc','xyz','pqr']
  vlink = "yt.com"
  name="Random guy"
  child_arr=[]

  constructor(private firestore: AngularFirestore, public auth : AuthserviceService) { }
  
  writeSubjectDetails(){
    var ref = this.firestore.collection('subjects')
    const contentVal=[]
    for(var i=0;i<this.initialSubs.length;i++){
      contentVal.push({
        name : this.cname[i],
        type : this.ctype[i],
        video_link : this.vlink
      })
      ref.add({
                name    : this.initialSubs[i],
                content : contentVal
              })
    }
  }

  readSubjects(){
    var sub = this.firestore.collection("subjects")
    return sub.snapshotChanges().pipe(
                                map(actions => actions.map(a => {
                                    const id = a.payload.doc.id;
                                    const data = a.payload.doc.data() as object;
                                    return {id, ...data};
                                    // this.subjectIDs.push([id, this.initialSubs[i]])
                                  }))
                              )
    // return this.subjectIDs
  }


  readUserDetails(){
    if(this.auth.isSignedIn){
      var user = this.firestore.collection("User", ref=>ref.where('email', '==', this.auth.getUserEmail()))
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
    const userid = this.auth.getUserId();
    const ref = this.firestore.collection('accounts').doc(userid)
    ref.set({
              name  : username,
              email : this.auth.getUserEmail(),
              phn   : phone
              // child_profile : [{}]
    });
  }


  writeChildProfiles(profile){
    if(this.auth.isSignedIn){
      const userid = this.auth.getUserId();
      console.log("my user id : ",userid);
      // var child = this.firestore.collection('accounts', ref=>ref.where('email','==',this.auth.getUserEmail()))
      // child.snapshotChanges().pipe(
      //   map(actions => actions.map(a => {
      //       const data = a.payload.doc.data() as any
      //       const id = a.payload.doc.id
      //       return {id, ...data}
      //     }))
      // ).subscribe(res=>{
      //     const userData = res
      //     const child_arr = userData[0].child_profile
      //     child_arr.push(profile)
      //     this.firestore.collection('accounts').doc(userid).update({child_profile : child_arr})
      // })
      const userRef = this.firestore.collection('accounts').doc(userid);
      userRef.get().toPromise().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                const resp = doc.data();
                const profiles = resp.child_profile;
                profiles.push(profile)
                userRef.update({child_profile : profiles});
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
      }
    }
  


  readChildProfiles(){  
    if(this.auth.isSignedIn){
      // var child = this.firestore.collection("accounts", ref=>ref.where('email','==',this.auth.getUserEmail()))
      // return child.snapshotChanges().pipe(
      //                                   map(actions => actions.map(a => {
      //                                       const data = a.payload.doc.data() as any
      //                                       return data
      //                                     }))
      //                                 )
      console.log(this.auth.getUserId())
      const userRef = this.firestore.collection('accounts').doc(this.auth.getUserId());
      
    //   userRef.get().toPromise().then((doc) => {
    //     if (doc.exists) {
    //         console.log("Document data:", doc.data());
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }).catch((error) => {
    //     console.log("Error getting document:", error);
    // });
    }
  }


}

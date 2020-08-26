import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthserviceService } from '../authservice.service';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PrototypeService {

  userEmail = ""
  initialSubs = ['math','science','cs']
  subjectIDs = []
  contentVal = []
  cname = ['abc','xyz','pqr']
  ctype = ['abc','xyz','pqr']
  vlink = "yt.com"
  name="Random guy"
  dob="1/01/2001"

  constructor(private firestore: AngularFirestore, public auth : AuthserviceService) { }
  
  subjectDetails(){
    var ref = this.firestore.collection('subjects')
    for(var i=0;i<this.initialSubs.length;i++){
      ref.add({
                name : this.initialSubs[i],
                content : this.contentVal.push({
                                                name : this.cname[i],
                                                type : this.ctype[i],
                                                video_link : this.vlink
                                              })
              })
    }
  }

  readUserDetails(){
    if(this.auth.isSignedIn){
      this.firestore.collection("accounts", ref=>ref.where('email', '==', this.auth.getUserEmail())).snapshotChanges().pipe(

      )
    }
  }

  writeAccounts(){
    var ref = this.firestore.collection('accounts')
    
    ref.add({
              name : this.name,
              dob  : this.dob,
              uid  : this.getUserDocId(),
              email: this.auth.getUserEmail()
              
    })

  }

  getUserDocId(){
    if(this.auth.isSignedIn){
      var user  = this.firestore.collection("User", ref=>ref.where('email', '==', this.auth.getUserEmail()))
      // return user.docs[0].id; 
      user.snapshotChanges().pipe(
                                    map(actions => actions.map(a => {
                                      const id = a.payload.doc.id
                                      return id
                                    }))
                                  )

    }
  }

  readChildProfiles(){  
    if(this.auth.isSignedIn){
      var ref = this.firestore.collection("accounts")
      return ref.snapshotChanges().pipe(
                                        map(actions => actions.map(a => {
                                            const data = a.payload.doc.data() as any
                                            return data                                            
                                          }))
                                      )
      
    }
  }

  readSubjects(){
    for(var i=0;i<this.initialSubs.length;i++){
      var sub = this.firestore.collection("subjects", ref=>ref.where('name','==',this.initialSubs[i]))
      sub.snapshotChanges().pipe(
                                  map(actions => actions.map(a => {
                                      const id = a.payload.doc.id
                                      this.subjectIDs.push([id, this.initialSubs[i]])
                                    }))
                                )
    }
    return this.subjectIDs
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';
import { PrototypeService } from '../services/prototype.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userEmail = '';
  student: any;

  isFormVisible = false
  user:any = {name:"", email:"", gender:"", role:"", imageurl:""}
  subscribed = false
  newStudent = {name:"", age:0, email:""}
  constructor(public route: Router, public auth: AuthserviceService, private storage: AngularFireStorage, public db: AngularFirestore,
              ) { }

  ngOnInit(): void {
    this.user = {name:"", email:"", gender:"", role:"", imageurl:""}
    console.log("isSigned in: ",this.auth.isSignedIn, this.auth.getUserId());
    // this.db.collection("Student")
    // .snapshotChanges()
    // .pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as any;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // )
    // .subscribe(res=>{
    //   this.student = res
    // })

    console.log(this.auth.getUserEmail())

    this.db.collection("User", ref=>ref.where('email', '==', this.auth.getUserEmail()))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.user = res
      this.subscribed = !this.subscribed

    })

 
  }

  LogOut(){
    this.auth.LogoutAuth()
  }

  addStudent(){
    this.isFormVisible = !this.isFormVisible
  }

  addNewStudent(){
    this.db.collection("Student").add(this.newStudent)
    this.newStudent = {name:"", age:0, email:""}
    this.isFormVisible = !this.isFormVisible
  }

  delStudent(data){
    this.db.collection("Student").doc(data.id).delete()
  }




}

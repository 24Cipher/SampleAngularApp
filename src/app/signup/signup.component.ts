import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';
import { PrototypeService } from '../services/prototype.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  arr = [{value: "Social Media", isChecked: false}, {value: "Company Website", isChecked: false}, {value: "Newsletter", isChecked: false}, {value: "Employee", isChecked: false}]

  user = {name:"", phone: "", email:"", gender:"", role:"", check:this.arr, imageurl:""}
  password=""
  selectedFile: File = null;
  fb;
  file;
  downloadURL: Observable<string>;
  isSaved = true;
  constructor(public route: Router,
              public auth: AuthserviceService,
              private storage: AngularFireStorage,
              public db: AngularFirestore,
              public service: PrototypeService) { }

  ngOnInit(): void {
  }

  SignUp(){
    this.isSaved = false;
    if(this.file) {
      var n = Date.now();
      const filePath = `ProfilePic/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`ProfilePic/${n}`, this.file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.fb = url;
              }
              this.user.imageurl = this.fb
              this.db.collection("User").add(this.user);
              this.service.readUserDetails();
              let status = false
              this.auth.signUpAuth(this.user.email, this.password)
              this.user = {name:"", phone:"", email:"",  gender:"", role:"", check:[], imageurl:""}
              this.arr = [{value: "Social Media", isChecked: false}, {value: "Company Website", isChecked: false}, {value: "Newsletter", isChecked: false}, {value: "Employee", isChecked: false}]
              this.isSaved = true;
            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
    } else {
      this.db.collection("User").add(this.user)
      let status = false
      this.auth.signUpAuth(this.user.email, this.password)
      this.user = {name:"", phone:"", email:"",  gender:"", role:"", check:[], imageurl:""}
      this.arr = [{value: "Social Media", isChecked: false}, {value: "Company Website", isChecked: false}, {value: "Newsletter", isChecked: false}, {value: "Employee", isChecked: false}]
      this.isSaved = true;
    }

  }

  onFileSelected(event) {
    this.file = event.target.files[0];

  }

  checkboxValueChange(i){
    const obj = this.arr[i]
    obj.isChecked = !obj.isChecked
  }
}

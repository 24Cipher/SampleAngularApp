import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrototypeService } from '../services/prototype.service';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  childProfileForm: FormGroup;
  subjects: any [];
  selectedSubjects: any [];
  constructor(private fb: FormBuilder,
              private service: PrototypeService,
              private auth: AuthserviceService) { }

  ngOnInit(): void {
    // this.service.writeSubjectDetails();
    this.childProfileForm = this.createAddChildProfileForm();
    this.fetchSubjects();
  }

  createAddChildProfileForm(): FormGroup{
    return this.fb.group(
      {
        name: [''],
        dob: [''],
        subjects: [this.selectedSubjects],
        grade: ['']
      }
    );
  }

  fetchSubjects(): void {

    this.service.readSubjects().subscribe((resp) => {
      this.subjects = resp;
      console.log(this.subjects);
      for (const subj of this.subjects) {
          subj.isChecked = false;
        }
    });
  }
  checkboxValueChange(i: number): void{
    // debugger;
    const obj = this.subjects[i];
    obj.isChecked = !obj.isChecked;
    this.filterSelectedSubjects();
  }

  addChild(): void {
    console.log(this.childProfileForm.value);
    this.service.writeChildProfiles(this.childProfileForm.value);
    this.childProfileForm.reset();
    this.subjects.forEach(subj => {
      subj.isChecked = false;
    });
  }

  filterSelectedSubjects(): void {
    const filteredSubjs =  this.subjects.filter(sub => sub.isChecked);
    this.selectedSubjects = filteredSubjs.map(sub => sub.id);
    console.log(this.selectedSubjects)
    this.childProfileForm.patchValue({
      subjects: this.selectedSubjects
    })
  }
}

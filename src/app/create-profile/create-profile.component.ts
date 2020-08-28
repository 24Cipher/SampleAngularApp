import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrototypeService } from '../services/prototype.service';

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
              private service: PrototypeService) { }

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
    const obj = this.subjects[i];
    obj.isChecked = !obj.isChecked;
    this.filterSelectedSubjects();
  }

  addChild(): void {
    console.log(this.childProfileForm.value);
  }

  filterSelectedSubjects(): void {
    this.selectedSubjects =  this.subjects.filter((sub) => {
      if (sub.isChecked){
        return sub.id;
      }
    });
  }
}

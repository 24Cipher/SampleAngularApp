import { Component, OnInit } from '@angular/core';
import { PrototypeService } from '../services/prototype.service';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
  profiles = [];
  constructor(private service: PrototypeService) { }

  ngOnInit(): void {
    this.readProfiles();
  }

  readProfiles(): void {
    this.service.readChildProfiles().subscribe((resp: any) => {
      console.log('my resp...', resp);
      this.profiles = resp.child_profile;
      this.profiles.forEach(profile => {
        const subjNames = this.service.subjectIdToName(profile.subjects);
        console.log(subjNames);
        profile.subjects = subjNames;
      });
      console.log(this.profiles);
    })

  }
}

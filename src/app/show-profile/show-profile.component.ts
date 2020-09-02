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
    this.service.readChildProfiles().subscribe(resp => {
      console.log('my resp...',resp);
    })

  }
}

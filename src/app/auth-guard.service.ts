import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthserviceService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public router: Router, public auth: AuthserviceService) { }

  canActivate(): boolean{
    if (this.auth.isUserSignedIn()) {
      return true;
    }
    else{
      this.router.navigateByUrl("\signin")
      return false;
    }
  }

}

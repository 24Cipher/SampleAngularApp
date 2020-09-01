import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ShowProfileComponent } from './show-profile/show-profile.component';


const routes: Routes = [
  {path:'', component: SigninComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'create-profile', component: CreateProfileComponent,  canActivate: [AuthGuardService]},
  {path: 'view-profile', component: ShowProfileComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

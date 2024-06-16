import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SchoolComponent } from './school/school.component';
import { KindergardenComponent } from './kindergarden/kindergarden.component';
import { SocialchildComponent } from './socialchild/socialchild.component';
import { SocialteenagerComponent } from './socialteenager/socialteenager.component';
import { PoiComponent } from './poi/poi.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'kindergarden', component: KindergardenComponent },
  { path: 'social-child-projects', component: SocialchildComponent },
  { path: 'social-teenager-projects', component: SocialteenagerComponent },
  { path: 'poi', component: PoiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

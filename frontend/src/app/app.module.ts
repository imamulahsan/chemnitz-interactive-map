import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SchoolComponent } from './school/school.component';
import { KindergardenComponent } from './kindergarden/kindergarden.component';
import { SocialchildComponent } from './socialchild/socialchild.component';
import { SocialteenagerComponent } from './socialteenager/socialteenager.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SchoolComponent,
    KindergardenComponent,
    SocialchildComponent,
    SocialteenagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

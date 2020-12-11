import { CommonModule } from '@angular/common'; 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";
import {AutosizeModule} from 'ngx-autosize';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { InfosComponent } from './infos/infos.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { Page404Component } from './page404/page404.component';
import { InfoEditorComponent } from './info-editor/info-editor.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export function tokenGetter() {
  return sessionStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    InfosComponent,
    LoginComponent,
    WelcomeComponent,
    CreateAccountComponent,
    Page404Component,
    InfoEditorComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AutosizeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:8888"],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

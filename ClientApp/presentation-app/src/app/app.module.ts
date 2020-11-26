import { CommonModule } from '@angular/common'; 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './projects/projects.component';
import { InfosComponent } from './infos/infos.component';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    InfosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TextareaAutosizeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

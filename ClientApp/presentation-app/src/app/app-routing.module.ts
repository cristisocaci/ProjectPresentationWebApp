import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfosComponent } from './infos/infos.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: 'infos', component: InfosComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'login', component: LoginComponent},
  {path: '',   redirectTo: '/projects', pathMatch: 'full' }, // redirect to 
  {path: '**', component: ProjectsComponent }  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

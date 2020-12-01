import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfosComponent } from './infos/infos.component';
import { ProjectsComponent } from './projects/projects.component';
import { WelcomeComponent} from './welcome/welcome.component';

const routes: Routes = [
  {path: 'infos', component: InfosComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: '',   component: WelcomeComponent }, // redirect to 
  {path: '**', redirectTo: ''}  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

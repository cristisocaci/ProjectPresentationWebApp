import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfosComponent } from './infos/infos.component';
import { ProjectsComponent } from './projects/projects.component';
import { WelcomeComponent} from './welcome/welcome.component';
import { Page404Component } from './page404/page404.component';

const routes: Routes = [
  {path: 'infos', component: InfosComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: '',   component: WelcomeComponent }, // redirect to 
  {path: '**', component: Page404Component}  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

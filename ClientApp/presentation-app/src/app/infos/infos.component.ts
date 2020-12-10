import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Identity } from '../shared/identity';
import { InfoEditorComponent } from '../info-editor/info-editor.component';


@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css'],
})
export class InfosComponent implements OnInit {
  
  @ViewChild(InfoEditorComponent) child: InfoEditorComponent;

  projectId: number;
  userId: any;
  projects: Project[];
  filteredProjects: Project[];
  projectsToBeDisplayed: number = 20;
  currentProject: Project = null;
  modifyProject: boolean = false;
  domain = sessionStorage.getItem('domain');
  identity: Identity;

  constructor(private route: ActivatedRoute,
    private projectService: ProjectsService,
    identity: Identity) {
      this.identity = identity;      
     }


  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.projectId = params.projectId;
        this.userId = params.userId;
      });
    this.projectService.loadProjectInfo(this.userId, this.projectId).subscribe(  // TODO: invalid user id or project id
      success => {
        if (success) {
          this.currentProject = this.projectService.currentProject; // Load current project information
          // Load the other projects
          this.projectService.loadProjects(this.userId).subscribe(success => {
            if (success) {
              this.projects = this.projectService.projects;
              this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
              console.log(this.filteredProjects);
            }
          })
        }
      });
  }


  
  modify() { // open the edit mode
    this.modifyProject = true;
  }
  
  filterProjects(value){ // filter the projects displayed on the right side
    if(!value){
        this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
    } // when nothing has typed
    console.log(this.filteredProjects)
    this.filteredProjects = this.projects.filter(
       item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    ).slice(0,this.projectsToBeDisplayed);
    
 }

 showMoreLessProjects(choice: string){ // change the number of projects displayed
   let step = 10;
   if(this.projectsToBeDisplayed < this.projects.length && choice == "m"){
     this.projectsToBeDisplayed += step;
     let value = (<HTMLInputElement>document.getElementById("filter")).value;
     this.filterProjects(value);
   }
   else if(choice == "l"){
     if(this.projectsToBeDisplayed-step < 0){
        this.projectsToBeDisplayed = 0;
     }
     else{
       this.projectsToBeDisplayed -= step;
     }
     let value = (<HTMLInputElement>document.getElementById("filter")).value;
     this.filterProjects(value);
   }
 }

}

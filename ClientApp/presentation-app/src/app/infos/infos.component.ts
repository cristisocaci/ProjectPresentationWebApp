import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Info } from '../shared/info';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent implements OnInit {

  projectId: number;
  userId: any;
  projects: Project[];
  currentProject: Project = null;
  modifyProject:boolean = false;
  addedInfo:number = 0;

  constructor(private route: ActivatedRoute,
              private projectService: ProjectsService,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.projectId = params.projectId;
        this.userId = params.userId;
      }
    )
    this.projectService.loadProjectInfo(this.userId, this.projectId).subscribe(
      success =>{
        if (success) {
          this.currentProject = this.projectService.currentProject; // Load current project information
          this.currentProject.infos.sort((a,b) => (a.position < b.position) ? -1 : 1)
          // Load the other projects
          this.projectService.loadProjects(this.userId).subscribe(success =>{
            if (success) {
              this.projects = this.projectService.projects.filter(project=>project.projectId!=this.currentProject.projectId);
            }
          })
          console.log(this.currentProject);
          this.addedInfo = 0;
        }
        
      })
    
  }

  modify(){
    this.modifyProject = true;
  }
  cancel(){
    
    for(var i=0; i<this.addedInfo; ++i){
      this.currentProject.infos.pop();
    }
    this.addedInfo = 0;
    this.modifyProject = false;
  }

  addInfo(type: string){
    var info = new Info();
    info.projectId = this.projectId;
    info.type = type;
    if (this.currentProject.infos.length != 0) {
      info.position = this.currentProject.infos[this.currentProject.infos.length - 1].position + 1;
    }
    else{
      info.position = 0;
    }
    this.currentProject.infos.push(info)
    this.addedInfo += 1;
  }

  updateProject(){
    for(var i = 0; i < this.currentProject.infos.length; ++i){
      var elem = <HTMLInputElement>document.getElementById(`${i}`);
      this.currentProject.infos[i].content = elem.value;
    }
    this.modifyProject = false;
    this.addedInfo = 0;
    this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
      success => {
        if(success){
          this.currentProject = this.projectService.currentProject; // Load current project information
          this.currentProject.infos.sort((a,b) => (a.position < b.position) ? -1 : 1);
          console.log(this.currentProject);
        }

      }
    )
  }

}

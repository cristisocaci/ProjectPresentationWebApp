import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
          this.currentProject = this.projectService.currentProject;
          console.log(this.currentProject);
        }
      })
    this.projectService.loadProjects(this.userId).subscribe(success =>{
      if (success) {
        this.projects = this.projectService.projects.filter(project=>project.projectId!=this.currentProject.projectId);
      }
    })
    
  }

}

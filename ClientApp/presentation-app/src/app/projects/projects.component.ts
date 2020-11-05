import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Array<Project>;
  nbOfDecks:string[];
  domain = 'http://localhost:8888';

  constructor(private projectService: ProjectsService) { }

  ngOnInit(): void {

    this.projectService.loadProjects("0").subscribe(success =>{
      if (success) {
        this.projects = this.projectService.projects;
        this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
      }
    })
  }

}

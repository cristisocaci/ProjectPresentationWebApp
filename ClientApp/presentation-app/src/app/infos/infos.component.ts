import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
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
  filteredProjects: Project[];
  currentProject: Project = null;
  modifyProject: boolean = false;


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
      success => {
        if (success) {
          this.currentProject = this.projectService.currentProject; // Load current project information
          this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1)
          // Load the other projects
          this.projectService.loadProjects(this.userId).subscribe(success => {
            if (success) {
              this.projects = this.projectService.projects.filter(project => project.projectId != this.currentProject.projectId);
              this.filteredProjects = [...this.projects];
            }
          })
          console.log(this.filteredProjects)
          console.log(this.currentProject);
        }

      })

  }

  modify() {
    this.modifyProject = true;
  }
  cancel() {
    Swal.fire({
      title: 'Cancel editing?',
      text: "All your changes will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.loadProjectInfo(this.userId, this.projectId).subscribe(
          success => {
            if (success) {
              this.currentProject = this.projectService.currentProject; // Load current project information
              this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1)

              this.modifyProject = false;
              console.log(this.currentProject);
            }
          })
      }
    })
  }

  addInfo(type: string) {
    let info = new Info();
    info.projectId = this.projectId;
    info.type = type;
    if (this.currentProject.infos.length != 0) {
      info.position = this.currentProject.infos[this.currentProject.infos.length - 1].position + 1;
    }
    else {
      info.position = 0;
    }
    this.currentProject.infos.push(info)
  }

  updateProject() {

    Swal.fire({
      title: 'Continue saving?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < this.currentProject.infos.length; ++i) {
          let elem = <HTMLInputElement>document.getElementById(`${i}`);
          this.currentProject.infos[i].content = elem.value;
        }
        this.modifyProject = false;
        this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
          success => {
            if (success) {
              this.currentProject = this.projectService.currentProject; // Load current project information
              this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
              console.log(this.currentProject);
            }

          }
        )
      }

    })

  }
  deleteInfo(index: number) {
    this.currentProject.infos.splice(index, 1);
  }
  filterProjects(value){
    if(!value){
        this.filteredProjects = [...this.projects];
    } // when nothing has typed
    console.log(this.filteredProjects)
    this.filteredProjects = [...this.projects].filter(
       item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
 }

}

import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import Swal from 'sweetalert2';
import uuidv4 from "uuid/dist/v4";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Array<Project>;
  nbOfDecks:string[];
  domain = 'http://localhost:8888';
  userId = "0";
  constructor(private projectService: ProjectsService) { }

  ngOnInit(): void {

    this.projectService.loadProjects(this.userId).subscribe(success =>{
      if (success) {
        this.projects = this.projectService.projects;
        this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
      }
    })
  }

  async createProject(){  // TODO : redirect to project info creation page
    const { value: formValues } = await Swal.fire({
      html: `this.createProject.html`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText:'Create',
      preConfirm: () => {
        return [
        (<HTMLInputElement>document.getElementById('input1')).value,
        (<HTMLInputElement>document.getElementById('input2')).value
      ]}
    });
    if (formValues) {
      var project= new Project();
      project.title=formValues[0];
      project.description=formValues[1];
      project.userId = this.userId;
      project.position = this.projects[0].position+1;
      // TODO photo
      console.log(project);
      this.projectService.addProject(project, this.userId).subscribe(success => {
        if(success){
          this.projects = this.projectService.projects;
          this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
          Swal.fire('Created!', '', 'success');
        }
        else{
          Swal.fire('Failed!', '', 'error');
        }
      });
    }
  }

  deleteProject(id: number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id, this.userId).subscribe(
          success => {
            if(success){
              this.projects = this.projectService.projects;
              this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
              Swal.fire('Deleted!', '', 'success');
            }
            else{
              Swal.fire('Failed!', '', 'error');
            }
        })
      }
    })








   
  }

}

import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  createProjectForm: FormGroup;
  selectedImage = {file: null, name: '', placeholder:'Choose project image'};

  constructor(private projectService: ProjectsService, 
              private formBuilder: FormBuilder) {
    this.createProjectForm = this.formBuilder.group({
      title:'',
      description:''
    })  
  }

  ngOnInit(): void {

    this.projectService.loadProjects(this.userId).subscribe(success =>{
      if (success) {
        this.projects = this.projectService.projects;
        this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
      }
    })
  }
  
  
  
  createProjectDisplay(){  // TODO : redirect to project info creation page
    var newproj = new Project();
    newproj.position = this.projects[0].position+1;
    this.projects.unshift(newproj);
    this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
  }
  closeCreationDisplay(){
    this.projects.shift();
    this.nbOfDecks = ("a".repeat(Math.ceil(this.projects.length/3))).split("");
  }
  saveImage(imageInput: any) {
    this.selectedImage.file = imageInput.files[0];
    var extension: string = this.selectedImage.file.name.split('.').pop();
    this.selectedImage.name = uuidv4() + '.' + extension;
    this.selectedImage.placeholder = this.selectedImage.file.name;
  }
  createProject(formValues){
    if (formValues) {
      // hide the form
      this.closeCreationDisplay();
      // create the new project and assign the form values 
      var project= new Project();
      project.title=formValues.title;
      project.description=formValues.description;
      project.userId = this.userId;
      project.position = this.projects[0].position+1;

      // save the photo
      if(this.selectedImage.name ==''){ project.photo = 'project.png'; }
      else{ 
        project.photo = this.selectedImage.name;
        this.projectService.uploadImage(this.selectedImage).subscribe( (res) => {}, (err) => {})
        this.selectedImage = {file: null, name: '', placeholder:'Choose project image'};
       }
       console.log(project);

       // save the project
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
      this.createProjectForm.reset();

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
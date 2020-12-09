import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import uuidv4 from "uuid/dist/v4";
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Identity } from '../shared/identity';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Array<Project>;
  filteredProjects: Array<Project>;
  domain = sessionStorage.getItem('domain');
  thispage = "http://localhost:4200"
  imgdomain = this.domain+'/img/';
  defaultimg = 'unnamed1.jpg';
  userId: string;
  createProjectForm: FormGroup;
  selectedImage = {file: null, name: '', placeholder:'Choose project image', browserImg: null};
  createmode: boolean = false;
  projectsToBeDisplayed: number = 18;
  identity: Identity;
  constructor(private projectService: ProjectsService, 
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              identity: Identity) {
    this.createProjectForm = this.formBuilder.group({
      title:'',
      description:''
    })  
    this.identity = identity;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.userId = params.userId;
        if(this.userId == null){
          this.router.navigate([''])
        }
      });

    this.projectService.loadProjects(this.userId).subscribe(success =>{  // TODO: invalid user id 
      if (success) {
        this.assignProjects();
      }
    })

  }

  assignProjects(){
    this.projects = this.projectService.projects;
    this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
    this.createmode = false;
  }

  createProjectDisplay(){
    if(!this.createmode){
      this.createmode = true;
      let newproj = new Project();
      if(this.projects.length != 0 ){
        newproj.position = this.projects[0].position+1;
      }
      else{
        newproj.position = 0;
      }
      this.filteredProjects.unshift(newproj);
    }
  }
  closeCreationDisplay(){
    this.filteredProjects.shift();
    this.createmode = false;
  }
  saveImage(imageInput: any) {
    let me = this;
    this.selectedImage.file = imageInput.files[0];
    let extension: string = this.selectedImage.file.name.split('.').pop();
    this.selectedImage.name = uuidv4() + '.' + extension;
    this.selectedImage.placeholder = this.selectedImage.file.name;
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedImage.file);
    reader.onload = function(){ me.selectedImage.browserImg = reader.result}

  }
  createProject(formValues){
    if (formValues) {
      // hide the form
      this.closeCreationDisplay();
      // create the new project and assign the form values 
      let project= new Project();
      project.title=formValues.title;
      project.description=formValues.description;
      project.userId = this.userId;
      if(this.projects.length != 0 ){
        project.position = this.projects[0].position+1;
      }
      else{
        project.position = 0;
      }

      // save the photo
      if(this.selectedImage.name ==''){ project.photo = this.defaultimg; }
      else{ 
        project.photo = this.selectedImage.name;
        this.projectService.uploadImages([this.selectedImage]).subscribe( (res) => {}, (err) => {})
        this.selectedImage = {file: null, name: '', placeholder:'Choose project image', browserImg: null};
       }
       console.log(project);

       // save the project
      this.projectService.addProject(project, this.userId).subscribe(success => {
        if(success){
          this.assignProjects();
          this.router.navigate(['/infos'], {queryParams:{projectId: this.projects[0].projectId, userId:this.userId}})
        }
        this.createProjectForm.reset();
      });
      
    }
  }

  moveLR(position: number, direction:string){
    for(let i = 0; i < this.projects.length; ++i){
      if(this.projects[i].position == position){
        if(direction =='l' && i>0){
          this.projects[i].position = this.projects[i-1].position;
          this.projects[i-1].position = position;
        }
        else if(direction == 'r' && i<this.projects.length-1){
          this.projects[i].position = this.projects[i+1].position;
          this.projects[i+1].position = position;
        }
        else{
          break;
        }
        this.projectService.updateProjects(this.userId, this.projects).subscribe(success=>{
          if(success){ this.assignProjects() }
        })
        break;
      }
    }
  }

  deleteProject(id: number, photoName: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteImage(photoName); //delete the project image

        this.projectService.deleteProject(id, this.userId).subscribe( 
          success =>{ if(success){ this.assignProjects(); } })
        
      }
    })
  
  }

  filterProjects(value){
    this.createmode = false;
    if(!value){
      this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
    } // when nothing has typed
    console.log(this.filteredProjects)
    this.filteredProjects = this.projects.filter(
       item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    ).slice(0,this.projectsToBeDisplayed);
  }

  showMoreLessProjects(choice: string){
    let step = 6;
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

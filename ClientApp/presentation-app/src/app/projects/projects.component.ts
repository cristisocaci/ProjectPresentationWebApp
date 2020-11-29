import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import uuidv4 from "uuid/dist/v4";
import { Router } from '@angular/router';



@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Array<Project>;
  filteredProjects: Array<Project>;
  nbOfDecks:string[];
  domain = 'http://localhost:8888'
  imgdomain = this.domain+'/img/';
  defaultimg = 'unnamed1.jpg';
  userId = "0";
  createProjectForm: FormGroup;
  selectedImage = {file: null, name: '', placeholder:'Choose project image', browserImg: null};
  createmode: boolean = false;

  constructor(private projectService: ProjectsService, 
              private formBuilder: FormBuilder,
              private router: Router) {
    this.createProjectForm = this.formBuilder.group({
      title:'',
      description:''
    })  
  }

  ngOnInit(): void {

    this.projectService.loadProjects(this.userId).subscribe(success =>{
      if (success) {
        this.projects = this.projectService.projects;
        this.filteredProjects = [...this.projects];
        this.nbOfDecks = this.calcNbOfDecks();
      }
    })
  }

  calcNbOfDecks(){
    return ("a".repeat(Math.ceil(this.filteredProjects.length/3))).split("");
  }
  createProjectDisplay(){
    if(!this.createmode){
      this.createmode = true;
      let newproj = new Project();
      newproj.position = this.projects[0].position+1;
      this.filteredProjects.unshift(newproj);
      this.nbOfDecks =  this.calcNbOfDecks();
    }
  }
  closeCreationDisplay(){
    this.filteredProjects.shift();
    this.nbOfDecks =  this.calcNbOfDecks();
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
      this.createmode = false;
      // create the new project and assign the form values 
      let project= new Project();
      project.title=formValues.title;
      project.description=formValues.description;
      project.userId = this.userId;
      project.position = this.projects[0].position+1;

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
          this.projects = this.projectService.projects;
          this.filteredProjects = [...this.projects];
          this.nbOfDecks =  this.calcNbOfDecks();
          this.router.navigate(['/infos'], {queryParams:{projectId: this.projects[0].projectId, userId:this.userId}})
        }
        else{

        }
        this.createProjectForm.reset();
      });
      
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
        this.projectService.deleteImage(photoName).subscribe();
        this.projectService.deleteProject(id, this.userId).subscribe(
          success => {
            if(success){
              this.projects = this.projectService.projects;
              this.filteredProjects = [...this.projects];
              this.nbOfDecks =  this.calcNbOfDecks();
              this.createmode = false;
            }
            else{

            }
        })
      }
    })
  
  }

  filterProjects(value){
    this.createmode = false;
    if(!value){
        this.filteredProjects = [...this.projects];
    } // when nothing has typed
    console.log(this.filteredProjects)
    this.filteredProjects = [...this.projects].filter(
       item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.nbOfDecks =  this.calcNbOfDecks();
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
          if(success){
            this.projects = this.projectService.projects;
            this.filteredProjects = [...this.projects];
            this.nbOfDecks = this.calcNbOfDecks();
            this.createmode = false;
            
          }
        })
        break;
      }
    }
  }
}

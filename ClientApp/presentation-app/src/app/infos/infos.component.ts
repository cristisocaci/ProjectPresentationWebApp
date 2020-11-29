import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Info } from '../shared/info';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import uuidv4 from "uuid/dist/v4";
import { DomSanitizer } from '@angular/platform-browser';

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
  domain = 'http://localhost:8888'
  imgdomain = this.domain+'/img/';
  topics:boolean = false;
  links: boolean = false;
  projectImage = {file: null, name: '', placeholder:'Change project image', browserImg: null};
  months: Array<string> =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  thisMonth: string;

  constructor(private route: ActivatedRoute,
    private projectService: ProjectsService,
    private sanitizer: DomSanitizer) {
      let d = new Date();
      let month = d.getMonth() + 1;
      let year = d.getFullYear();
      this.thisMonth = "" + year + "-" + ("0"+(month)).slice(-2);
      console.log(this.thisMonth)
     }


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
          this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
          this.checkIfTopicOrLink()
          // Load the other projects
          this.projectService.loadProjects(this.userId).subscribe(success => {
            if (success) {
              this.projects = this.projectService.projects.filter(project => project.projectId != this.currentProject.projectId);
              this.filteredProjects = [...this.projects];
              console.log(this.filteredProjects);
            }
          })
          console.log(this.currentProject);
          
        }

      })

      

  }

  checkIfTopicOrLink(){
    this.topics = false;
    this.links = false;
    for(let i=0; i < this.currentProject.infos.length; ++i){
      if(this.currentProject.infos[i].type == "topic"){
        this.topics = true;
        console.log("topic");
      }
      else if(this.currentProject.infos[i].type == "link"){
        this.links = true;
        console.log("link");
      }
    }
    
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
              this.checkIfTopicOrLink(); 
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
    info.content = '';
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
          if(this.currentProject.infos[i].type == "topic"  ){
            let elem = <HTMLInputElement>document.getElementById(`t${i}`);
            this.currentProject.infos[i].content = elem.value;
            continue;
          }
          else if(this.currentProject.infos[i].type == "link"){
            let label = <HTMLInputElement>document.getElementById(`ladd${i}`);
            let link = <HTMLInputElement>document.getElementById(`lcon${i}`);
            this.currentProject.infos[i].additionalData = label.value;
            this.currentProject.infos[i].content = link.value;
            continue;
          }
          else if(this.currentProject.infos[i].type == "ytvideo"){
            let label = <HTMLInputElement>document.getElementById(`ytlabel${i}`);
            let link = <HTMLInputElement>document.getElementById(`ytlink${i}`);
            this.currentProject.infos[i].additionalData = label.value;
            let watchtemplate = "https://www.youtube.com/watch?v=";
            let embedtemplate = "https://www.youtube.com/embed/";
            let linkval = "";
            if(link.value.substring(0,embedtemplate.length) == embedtemplate){
              linkval = link.value;
            }
            else{
              linkval = embedtemplate + link.value.substring(watchtemplate.length);
            }
            this.currentProject.infos[i].content = linkval;

            continue;
          }
          let elem = <HTMLInputElement>document.getElementById(`${i}`);
          this.currentProject.infos[i].content = elem.value;
        }
        this.currentProject.title = (<HTMLInputElement>document.getElementById(`projTitle`)).value;
        this.currentProject.description = (<HTMLInputElement>document.getElementById(`projDescription`)).value;
        
        this.currentProject.startDate = new Date((<HTMLInputElement>document.getElementById(`startdate`)).value);
        this.currentProject.endDate = new Date((<HTMLInputElement>document.getElementById(`enddate`)).value);
        
        // save the photo
        if(this.projectImage.name !=''){
          this.currentProject.photo = this.projectImage.name;
          this.projectService.uploadImages([this.projectImage]).subscribe( (res) => {
            // after the photo is saved, update the project
            this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
              success => {
                if (success) {
                  this.currentProject = this.projectService.currentProject; // Load current project information
                  this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
                  this.checkIfTopicOrLink();
                  console.log(this.currentProject);
                }
              }
            )
          }, (err) => {})
          this.projectImage = {file: null, name: '', placeholder:'Choose project image', browserImg: null};
         }
         else{
          this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
            success => {
              if (success) {
                this.currentProject = this.projectService.currentProject; // Load current project information
                this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
                this.checkIfTopicOrLink();
                console.log(this.currentProject);
              }
            }
          )
         }
        this.modifyProject = false;
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

  saveImage(imageInput: any) {
    let me = this;
    this.projectImage.file = imageInput.files[0];
    let extension: string = this.projectImage.file.name.split('.').pop();
    this.projectImage.name = uuidv4() + '.' + extension;
    this.projectImage.placeholder = this.projectImage.file.name;
    let reader = new FileReader();
    reader.readAsDataURL(this.projectImage.file);
    reader.onload = function () { me.projectImage.browserImg = reader.result }

  }

}

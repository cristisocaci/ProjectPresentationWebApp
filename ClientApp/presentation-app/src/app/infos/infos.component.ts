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
  projectsToBeDisplayed: number = 20;
  currentProject: Project = null;
  modifyProject: boolean = false;
  domain = 'http://localhost:8888'
  imgdomain = this.domain+'/img/';
  topics:boolean = false;
  links: boolean = false;
  projectImage = {file: null, name: '', placeholder:'Change project image', browserImg: null};
  months: Array<string> =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  thisMonth: string;
  infoImages:Array<any> = new Array<any> ();


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
          this.assignCurrentProject();
          // Load the other projects
          this.projectService.loadProjects(this.userId).subscribe(success => {
            if (success) {
              this.projects = this.projectService.projects;
              this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
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

  populateInfoImages(){
    for(let i = 0; i < this.currentProject.infos.length; ++i){
      if(this.currentProject.infos[i].type=="image"){
        let aux = { file: null, name: null, placeholder: null, browserImg: null, index: i, oldname: null ,new: false, deleted:false};
        aux.name = this.currentProject.infos[i].content;
        aux.placeholder = aux.name;
        aux.new = false;
        this.infoImages.push(aux)
      }
    }
  }


  assignCurrentProject(){
    this.currentProject = this.projectService.currentProject; // Load current project information
    this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
    this.populateInfoImages();
    this.checkIfTopicOrLink();
    this.modifyProject = false;
    console.log(this.currentProject);
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
          success => { if (success) { this.assignCurrentProject() }}
        )
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
    this.currentProject.infos.push(info);

  }

  deleteInfo(index: number) {
    if(this.currentProject.infos[index].type == 'image'){
      let i = this.infoImages.findIndex(x=>x.index==index);
      if(i != -1){
        this.infoImages[i].deleted = true;
      }
    }
    this.currentProject.infos.splice(index, 1);
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
          }
          else if(this.currentProject.infos[i].type == "link"){
            let label = <HTMLInputElement>document.getElementById(`ladd${i}`);
            let link = <HTMLInputElement>document.getElementById(`lcon${i}`);
            this.currentProject.infos[i].additionalData = label.value;
            this.currentProject.infos[i].content = link.value;
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
          }
          else if(this.currentProject.infos[i].type == "image"){
            let content = this.infoImages[this.infoImages.findIndex(x=>x.index == i)];
            if( content != null){
              let label = <HTMLInputElement>document.getElementById(`imglabel${i}`);
              this.currentProject.infos[i].additionalData = label.value;
              this.currentProject.infos[i].content = content.name;
            }
          }
          else{
            let elem = <HTMLInputElement>document.getElementById(`${i}`);
            this.currentProject.infos[i].content = elem.value;
          }
        }
        this.currentProject.title = (<HTMLInputElement>document.getElementById(`projTitle`)).value;
        this.currentProject.description = (<HTMLInputElement>document.getElementById(`projDescription`)).value;
        this.currentProject.startDate = new Date((<HTMLInputElement>document.getElementById(`startdate`)).value);
        this.currentProject.endDate = new Date((<HTMLInputElement>document.getElementById(`enddate`)).value);
        
        // save the project photo
        if (this.projectImage.name != '') {
          this.projectService.deleteImage(this.currentProject.photo).subscribe();
          this.currentProject.photo = this.projectImage.name;
          this.projectService.uploadImages([this.projectImage]).subscribe()
          this.projectImage = { file: null, name: '', placeholder: 'Choose project image', browserImg: null };
        }

        // save the info photos
        if(this.infoImages.length != 0){
          // delete changed photos
          for(let i=0; i < this.infoImages.length; ++i){
            if(this.infoImages[i].oldname != null ){
              this.projectService.deleteImage(this.infoImages[i].oldname).subscribe();
            }
            if(this.infoImages[i].deleted && !this.infoImages[i].new){
              this.projectService.deleteImage(this.infoImages[i].name).subscribe();
            }
          }
          this.projectService.uploadImages(this.infoImages.filter(img=>img.new==true)).subscribe();
          this.infoImages = new Array<any> ();

        }

        // update the project
        this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
           success => { if (success) { this.assignCurrentProject() }}
        )
      }
    })
  }

  saveProjectImage(imageInput: any) {
    let me = this;
    this.projectImage.file = imageInput.files[0];
    let extension: string = this.projectImage.file.name.split('.').pop();
    this.projectImage.name = uuidv4() + '.' + extension;
    this.projectImage.placeholder = this.projectImage.file.name;
    let reader = new FileReader();
    reader.readAsDataURL(this.projectImage.file);
    reader.onload = function () { me.projectImage.browserImg = reader.result }

  }

  saveImage(imageInput: any, index: number){
    let imagesIndex = this.infoImages.findIndex(x => x.index == index);
    if (imagesIndex == -1) {
      let me = this;
      let aux = { file: null, name: null, placeholder: null, browserImg: null, index: index, oldname: null ,new: false, deleted: false};
      aux.file = imageInput.files[0];
      let extension: string = aux.file.name.split('.').pop();
      aux.name = uuidv4() + '.' + extension;
      aux.placeholder = aux.file.name;
      aux.new = true;
      this.infoImages.push(aux)
      let reader = new FileReader();
      reader.readAsDataURL(this.infoImages[this.infoImages.length - 1].file);
      reader.onload = function () { me.infoImages[me.infoImages.length-1].browserImg = reader.result }
    }
    else{
      let me = this;
      this.infoImages[imagesIndex].oldname = this.infoImages[imagesIndex].name;
      this.infoImages[imagesIndex].file = imageInput.files[0];
      let extension: string = this.infoImages[imagesIndex].file.name.split('.').pop();
      this.infoImages[imagesIndex].name = uuidv4() + '.' + extension;
      this.infoImages[imagesIndex].placeholder = this.infoImages[imagesIndex].file.name;
      this.infoImages[imagesIndex].new = true;
      let reader = new FileReader();
      reader.readAsDataURL(this.infoImages[imagesIndex].file);
      reader.onload = function () { me.infoImages[imagesIndex].browserImg = reader.result }
    }
    
  }

  filterProjects(value){
    if(!value){
        this.filteredProjects = this.projects.slice(0,this.projectsToBeDisplayed);
    } // when nothing has typed
    console.log(this.filteredProjects)
    this.filteredProjects = this.projects.filter(
       item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    ).slice(0,this.projectsToBeDisplayed);
    
 }

 showMoreLessProjects(choice: string){
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import uuidv4 from "uuid/dist/v4";


import { Identity } from '../shared/identity';
import { Info } from '../shared/info';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';


@Component({
  selector: 'info-editor',
  templateUrl: './info-editor.component.html',
  styleUrls: ['./info-editor.component.css']
})
export class InfoEditorComponent implements OnInit {

  @Input()
  modifyProject:boolean;
  @Output()
  modifyProjectChange = new EventEmitter();
  @Input()
  projectId: number;
  @Input()
  userId: string;

  currentProject:Project;
  infoImages:Array<any>;
  projectImage = {file: null, name: '', placeholder:'Change project image', browserImg: null};
  domain = sessionStorage.getItem('domain');
  imgdomain = this.domain+'/img/';
  months: Array<string> =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  thisMonth: string;
  topics:boolean = false;
  links: boolean = false;
  
  identity: Identity;
  sanitizer: DomSanitizer;
 



  constructor(sanitizer: DomSanitizer,
              identity: Identity,
              private projectService: ProjectsService,) { 
    let d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    this.thisMonth = "" + year + "-" + ("0"+(month)).slice(-2);
    
    this.identity = identity;      
    this.sanitizer = sanitizer;
  }

  ngOnInit(): void {
    this.assignCurrentProject(this.currentProject)   
  }


  assignCurrentProject(proj=null){ // used after the data came from the server
    if(proj == null){
    this.currentProject = this.projectService.currentProject; // Load current project information
    }else{
      this.currentProject = proj;
    }
    this.currentProject.infos.sort((a, b) => (a.position < b.position) ? -1 : 1);
    this.projectImage = { file: null, name: '', placeholder: 'Choose project image', browserImg: null };
    this.populateInfoImages();
    this.checkIfTopicOrLink();
    this.modifyProject = false;
    this.modifyProjectChange.emit(this.modifyProject);
    console.log(this.currentProject);
  }

  checkIfTopicOrLink(){ // check if there is a topic or a link in order to display "Tags" or "Other links" on the page
    this.topics = false;
    this.links = false;
    for(let i=0; i < this.currentProject.infos.length; ++i){
      if(this.currentProject.infos[i].type == "topic"){
        this.topics = true;
      }
      else if(this.currentProject.infos[i].type == "link"){
        this.links = true;
      }
    }
  }

  modify() { // open the edit mode
    this.modifyProject = true;
    this.modifyProjectChange.emit(this.modifyProject);
  }

  populateInfoImages(){ // create an array with all the photos from the infos section of the project 
    this.infoImages =  new Array<any> ();
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

  cancel() { // cancel the edit mode
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

  addInfo(type: string) { // add a new info to the project
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

  saveProjectImage(imageInput: any) { // when an image is uploaded for the project image, save it in the projectImage object
    let me = this;
    this.projectImage.file = imageInput.files[0];
    let extension: string = this.projectImage.file.name.split('.').pop();
    this.projectImage.name = uuidv4() + '.' + extension;
    this.projectImage.placeholder = this.projectImage.file.name;
    let reader = new FileReader();
    reader.readAsDataURL(this.projectImage.file);
    reader.onload = function () { me.projectImage.browserImg = reader.result }
  }

  saveImage(imageInput: any, index: number){ // when an image is uploaded for the info section, save it in the images array
    let imagesIndex = this.infoImages.findIndex(x => x.index == index); // check if the image is already in the array

    if (imagesIndex == -1) { // if it isn`t, create a new object and append it 
      let aux = { file: null, name: null, placeholder: null, browserImg: null, index: index, oldname: null ,new: false, deleted: false};
      this.infoImages.push(aux)
      imagesIndex = this.infoImages.length-1;
    }
    else{ //  save the old photo name for deleting
      this.infoImages[imagesIndex].oldname = this.infoImages[imagesIndex].name;
    }

    // save the info
    this.infoImages[imagesIndex].file = imageInput.files[0];
    let extension: string = this.infoImages[imagesIndex].file.name.split('.').pop();
    this.infoImages[imagesIndex].name = uuidv4() + '.' + extension;
    this.infoImages[imagesIndex].placeholder = this.infoImages[imagesIndex].file.name;
    this.infoImages[imagesIndex].new = true;
    let me = this;
    let reader = new FileReader();
    reader.readAsDataURL(this.infoImages[imagesIndex].file);
    reader.onload = function () { me.infoImages[imagesIndex].browserImg = reader.result }
  }


  deleteInfo(index: number) {
    if(this.currentProject.infos[index].type == 'image'){ // if info is an image, mark it to be deleted
      let i = this.infoImages.findIndex(x=>x.index==index);
      if(i != -1){
        this.infoImages[i].deleted = true;
      }
    }
    else{ // change indexes saved in the images array to match those from the info array
      for(let i = 0; i < this.infoImages.length; ++i){
        if(this.infoImages[i].index > index){
          this.infoImages[i].index -= 1;
        }
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
        
        this.changesBeforeUploadOnServer();
        
        // delete info images marked for deletion
        this.deleteChangedImages();

        // save the images
        let saveInfoImg = this.infoImages.filter(img=>img.new==true);
        if (this.projectImage.file != null || saveInfoImg.length != 0) {

          if(this.projectImage.file != null){
            this.projectService.deleteImage(this.currentProject.photo);
            this.currentProject.photo = this.projectImage.name;
            saveInfoImg = saveInfoImg.concat([this.projectImage]);
          }
          this.projectService.uploadImages(saveInfoImg).subscribe(success => { if (success) { this.assignCurrentProject() }});
        }

        // update the project
        this.projectService.updateProject(this.userId, this.projectId, this.currentProject).subscribe(
          success => { if (success) { this.assignCurrentProject() }}
        )
      }
    })
  }

  changesBeforeUploadOnServer(){
    for (let i = 0; i < this.currentProject.infos.length; ++i) {
      if(this.currentProject.infos[i].type == "ytvideo"){ // verify that the link is saved with embed/videoId so it can be userd by iframe
        let watchtemplate = "https://www.youtube.com/watch?v=";
        let embedtemplate = "https://www.youtube.com/embed/";
        let idLength = 11;
        if(this.currentProject.infos[i].content.substring(0,embedtemplate.length) != embedtemplate){
          this.currentProject.infos[i].content = embedtemplate + this.currentProject.infos[i].content.substring(watchtemplate.length, watchtemplate.length+idLength);;
        }
      }
      else if(this.currentProject.infos[i].type == "image"){ // save the name of the image in the info array 
        let content = this.infoImages[this.infoImages.findIndex(x=>x.index == i)];
        if( content != null){
          this.currentProject.infos[i].content = content.name;
        }
      }
    }
    this.currentProject.startDate = new Date((<HTMLInputElement>document.getElementById(`startdate`)).value);
    this.currentProject.endDate = new Date((<HTMLInputElement>document.getElementById(`enddate`)).value);
  }


  deleteChangedImages(){ // delete the images marked as changed or deleted
    for(let i=0; i < this.infoImages.length; ++i){
      if(this.infoImages[i].oldname != null ){
        this.projectService.deleteImage(this.infoImages[i].oldname);
      }
      if(this.infoImages[i].deleted && !this.infoImages[i].new){
        this.projectService.deleteImage(this.infoImages[i].name);
      }
    }
  }


}

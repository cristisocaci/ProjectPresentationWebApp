import { Injectable } from '@angular/core';
import { Project } from './project';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  domain = 'http://localhost:8888';
  imageFolder='img'
  projects: Project[];
  currentProject: Project;

  constructor(private http : HttpClient) { }

  changeImages(){
    this.projects = this.projects.map<Project>(
      proj=>{
        proj.photo = this.domain+`/${this.imageFolder}/`+proj.photo;
        return proj;
      });
  }

  loadProjects(userId: string): Observable<boolean>{
    return this.http.get<any>(this.domain+`/api/users/${userId}/projects`).pipe(
      map( (data: Project[]) => {
        this.projects = data.sort((a, b)=> ((a.position < b.position) ? 1: -1)); // arrange the project in reverse order according to their position
        this.changeImages();
        console.log(this.projects)
        return true;
      }));
  }

  addProject(project: Project, userId:string){
    return this.http.post<Project>(this.domain+`/api/users/${userId}/projects`, project).pipe(
      map( (data: Project) => {
        data.photo = this.domain+`/${this.imageFolder}/`+data.photo;
        this.projects.unshift(data);
        return true;
      }));
  }

  deleteProject(projectId:number, userId: string){
    return this.http.post(this.domain+`/api/users/${userId}/projects/${projectId}`, null).pipe(
      map( (data: any) => {
        this.projects = this.projects.filter(function( proj ) {return proj.projectId !== projectId;});
        return true;
      })
    );
  }

  uploadImage(image: any): Observable<any> {
    const formData = new FormData();
    formData.append("file", image.file, image.name);
    return this.http.post(this.domain+`/api/images`, formData);
  }

  loadProjectInfo(userId:string, projectId: number){
    return this.http.get<any>(this.domain+`/api/users/${userId}/projects/${projectId}`).pipe(
      map( (data: Project) => {
        this.currentProject = data;
        return true;
      }));
  }

  updateProject(userId: string, projectId: number, project: Project){
  
    return this.http.put<any>(this.domain+`/api/users/${userId}/projects/${projectId}`, project).pipe(
      map( (data: Project) => {
        this.currentProject = data;
        console.log(data);
        return true;
      }));
  }
}

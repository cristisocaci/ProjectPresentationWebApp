import { Injectable } from '@angular/core';
import { Project } from './project';
import { HttpClient} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  domain = sessionStorage.getItem('domain');
  projects: Project[];
  currentProject: Project;
  defaultimg = 'unnamed1.jpg';

  constructor(private http : HttpClient,
              private router: Router,) { }

  loadProjects(userId: string): Observable<boolean>{
    return this.http.get<any>(this.domain+`/api/users/${userId}/projects`).pipe(
      map( (data: Project[]) => {
        for(let i=0; i < data.length; i++){
          if(data[i].startDate != null){
          data[i].startDate = new Date(data[i].startDate);
          }
          if(data[i].endDate != null){
            data[i].endDate = new Date(data[i].endDate);
          }
        }
        this.projects = data.sort((a, b)=> ((a.position < b.position) ? 1: -1)); // arrange the project in reverse order according to their position
        console.log("Loaded projects");
        console.log(this.projects);
        return true;
      }),
      catchError(e => {
        if(e.status == 404){
          console.log(e);
          this.router.navigate(['/404']);
          return new Observable<any>();
        }
      } 
      ));
  }

  addProject(project: Project, userId:string){
    return this.http.post<Project>(this.domain+`/api/users/${userId}/projects`, project).pipe(
      map( (data: Project) => {
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

  uploadImages(images: any[]): Observable<any> {
    const formData = new FormData();
    for(let i=0; i < images.length; ++i){
      formData.append("file", images[i].file, images[i].name);
    }
    console.log(images);
    return this.http.post(this.domain+`/api/images`, formData).pipe(
      map((data: any) => {
        console.log(data);
        return true;
      })
    );
  }

  deleteImage(name: string){
    if (name != this.defaultimg) {
      this.http.post(this.domain + `/api/images/` + name, null).pipe(
        map((data: any) => {
          console.log(data);
          return true;
        })
      ).subscribe();
    }
  }

  loadProjectInfo(userId:string, projectId: number){
    return this.http.get<any>(this.domain+`/api/users/${userId}/projects/${projectId}`).pipe(
      map( (data: Project) => {
        if(data.startDate != null){
          data.startDate = new Date(data.startDate);
        }
        if(data.endDate != null){
          data.endDate = new Date(data.endDate);
        }
        this.currentProject = data;
        return true;
      }),
      catchError(e=>{
        if(e.status == 404){
          console.log(e);
          this.router.navigate(['/404']);
          return new Observable<any>();
        }
      })  
    );
  }

  updateProject(userId: string, projectId: number, project: Project){
    return this.http.put<any>(this.domain+`/api/users/${userId}/projects/${projectId}`, project).pipe(
      map( (data: Project) => {
        if(data.startDate != null){
          data.startDate = new Date(data.startDate);
        }
        if(data.endDate != null){
          data.endDate = new Date(data.endDate);
        }
        this.currentProject = data;
        console.log(data);
        return true;
      }));
  }

  updateProjects(userId, projects: Project[]){

    return this.http.put<any>(this.domain+`/api/users/${userId}/projects`, projects).pipe(
      map( (data: Project[]) => {
        for(let i=0; i < data.length; i++){
          if(data[i].startDate != null){
            data[i].startDate = new Date(data[i].startDate);
          }
          if(data[i].endDate != null){
            data[i].endDate = new Date(data[i].endDate);
          }
        }
        this.projects = data.sort((a, b)=> ((a.position < b.position) ? 1: -1)); // arrange the project in reverse order according to their position
        console.log("Updated projects:");
        console.log(this.projects);
        return true;
      }));
  }

  deleteUser(userId){
    return this.http.post(this.domain+`/api/users/${userId}`, null).pipe(
      map( (data: any) => {
        return true;
      })
    );
  }
}

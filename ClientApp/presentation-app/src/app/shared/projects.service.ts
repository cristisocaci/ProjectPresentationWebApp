import { Injectable } from '@angular/core';
import { Project } from './project';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  domain = 'http://localhost:8888';
  public projects: Project[];

  constructor(private http : HttpClient) { }

  loadProjects(userId: string): Observable<boolean>{
    return this.http.get<any>(this.domain+`/api/users/${userId}/projects`).pipe(
      map( (data: any[]) => {
        this.projects = data;
        console.log(this.projects)
        return true;
      }));
  }

}

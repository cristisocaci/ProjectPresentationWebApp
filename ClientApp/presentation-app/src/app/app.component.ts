import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'presentation-app';
  response: any;
  constructor(private http : HttpClient){}
  ngOnInit(){
      this.http.get<any>('http://localhost:8888/api/users/0/projects').subscribe({
      next: data => {
        this.response = data;
        console.log(data)
      },
      error: error => {
        console.error('There was an error!', error);
      }
    })
  }
  
}

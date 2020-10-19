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
    this.http.get<any>('http://localhost:5000/api/values/1').subscribe({
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
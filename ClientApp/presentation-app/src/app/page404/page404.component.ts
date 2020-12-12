import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component implements OnInit {
  
  logo = sessionStorage.getItem("logo");

  constructor() { }

  ngOnInit(): void {
  }

}

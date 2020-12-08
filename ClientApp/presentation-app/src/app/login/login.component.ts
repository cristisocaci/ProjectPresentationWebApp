import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $AB from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  domain = sessionStorage.getItem('domain');

  @Input()
  redirect: string;

  constructor(private http : HttpClient,
              private router: Router,) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    const credentials = JSON.stringify(form.value);
    this.http.post(this.domain+"/api/login", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      const token = (<any>response).token;
      const userId = (<any>response).userId;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("jwt", token);
      this.invalidLogin = false;
      if(this.redirect == "true"){
        this.router.navigate(['/projects'], {queryParams:{userId:userId}})
      }
      (<any>$("#login")).modal('hide');
    }, err => {
      this.invalidLogin = true;
    });
  }

}

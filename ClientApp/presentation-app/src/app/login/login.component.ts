import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  domain = 'http://localhost:8888';

  constructor(private http : HttpClient,
              private router: Router) { }

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
      sessionStorage.setItem("userid", userId);
      sessionStorage.setItem("jwt", token);
      this.invalidLogin = false;
    }, err => {
      this.invalidLogin = true;
    });
  }

}

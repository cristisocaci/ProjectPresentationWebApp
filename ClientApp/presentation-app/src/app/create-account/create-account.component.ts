import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  invalidLogin: boolean;
  domain = sessionStorage.getItem('domain');

  constructor(private http : HttpClient,
              private router: Router,) { }

  ngOnInit(): void {
  }

  createAccount(form: NgForm) {
    const credentials = JSON.stringify(form.value);
    this.http.post(this.domain+"/api/users", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      const token = (<any>response).token;
      const userId = (<any>response).userId;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("jwt", token);
      this.invalidLogin = false;
      this.router.navigate(['/projects'], {queryParams:{userId:userId}})
    }, err => {
      this.invalidLogin = true;
    });
  }
  
}

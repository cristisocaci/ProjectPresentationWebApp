import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as $AB from 'jquery';

import { Validation } from '../shared/validation';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  invalidCreate: boolean;
  domain = sessionStorage.getItem('domain');
  message: string;
  passproblem: boolean;

  constructor(private http : HttpClient,
              private router: Router,
              private validation: Validation) { }

  ngOnInit(): void {
  }

  createAccount(form: NgForm) {
    this.passproblem = false;

    if(!this.validation.validateUsername(form.value.username)){
      this.message = "Invalid Username";
      this.invalidCreate = true;
      return;
    }
    if(!this.validation.validatePassword(form.value.password)){
      this.message = "Invalid Password";
      this.invalidCreate = true;
      this.passproblem = true;
      return;
    }
    if(form.value.password != form.value.confirmpassword){
      this.message = "Passwords do not match";
      this.invalidCreate = true;
      return;
    }
    delete form.value.confirmpassword;
    
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
      this.router.navigate(['/projects'], {queryParams:{userId:userId}});
      (<any>$("#create")).modal('hide');

    }, err => {
      this.message = err.error;
      if(this.message == "Invalid Password"){
        this.passproblem = true;
      }
      this.invalidCreate = true;
    }); 
  }

  dismiss(){
    this.invalidCreate = false;
    this.passproblem = false;
  }
  
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Validation } from '../shared/validation';
import * as $AB from 'jquery';


@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input() userId:string;

  invalidChange: boolean;
  domain = sessionStorage.getItem('domain');
  message: string;
  passproblem: boolean;

  constructor(private http : HttpClient,
              private router: Router,
              private validation: Validation) { }

  ngOnInit(): void {
  }
  changePassword(form: NgForm) {

    this.passproblem = false;
    if(form.value.password == ""){
      this.message="Enter the old password";
      this.invalidChange = true;
      return;
    }
    if(!this.validation.validatePassword(form.value.newPassword)){
      this.message = "Invalid new password";
      this.invalidChange = true;
      this.passproblem = true;
      return;
    }
    if(form.value.newPassword != form.value.newPasswordConfirm){
      this.message = "Passwords do not match";
      this.invalidChange = true;
      return;
    }
    delete form.value.newPasswordConfirm;
    
    const credentials = JSON.stringify(form.value);
    this.http.put(this.domain+"/api/users/"+this.userId, credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      console.log(response)
      this.router.navigate(['/projects'], {queryParams:{userId:this.userId}});
      (<any>$("#change")).modal('hide');

    }, err => {
      this.message = err.error;
      if(this.message == "Invalid New Password"){
        this.passproblem = true;
      }
      this.invalidChange = true;
    }); 
  }

  dismiss(){
    this.invalidChange = false;
    this.passproblem = false;
  }
}

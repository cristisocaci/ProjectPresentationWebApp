import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor( private jwtHelper: JwtHelperService ) { }

  ngOnInit(): void {
  }
  
  isUserAuthenticated() {
    const token: string = sessionStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  getCurrentUserId(){
    return sessionStorage.getItem("userId");
  }
  logOut() {
    console.log("Logging out")
    sessionStorage.removeItem("jwt");
  }
}

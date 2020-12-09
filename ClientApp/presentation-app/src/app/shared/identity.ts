import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
  })
  
export class Identity {

    constructor(private jwtHelper: JwtHelperService) { }

    isUserAuthenticated() {
        const token: string = sessionStorage.getItem("jwt");
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            return true;
        }
        else {
            return false;
        }
    }
    isUserAuthorized(userId) {
        if (userId == sessionStorage.getItem("userId")) {
            return true;
        }
        else {
            return false;
        }
    }
    getCurrentUserId() {
        return sessionStorage.getItem("userId");
    }

    logOut() {
        console.log("Logging out")
        sessionStorage.removeItem("jwt");
    }

}

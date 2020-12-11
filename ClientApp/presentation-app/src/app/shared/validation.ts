import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Validation {

    validateUsername(username){
        if (/^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(username)) {
            return (true)
        }
        return (false)
    }

    validatePassword(pass) {
        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(pass)) {
            return true;
        }
        else {
            return false;
        }
    }

}

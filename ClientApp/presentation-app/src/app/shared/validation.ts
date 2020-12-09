import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Validation {

    validateEmail(email){
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
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

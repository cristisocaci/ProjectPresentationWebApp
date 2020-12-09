import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Identity } from '../shared/identity';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  identity: Identity;

  constructor( identity: Identity ) { 
    this.identity = identity;
  }

  ngOnInit(): void {
  }
  
}

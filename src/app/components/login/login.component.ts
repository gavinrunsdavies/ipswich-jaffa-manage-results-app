import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  //email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // getErrorMessage() {
  //   return this.email.hasError('required') ? 'You must enter a value' :
  //       this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  login() {
    localStorage.setItem('isLoggedin', 'true'); // TODO
    this.router.navigate(['/dashboard']);
  }
}

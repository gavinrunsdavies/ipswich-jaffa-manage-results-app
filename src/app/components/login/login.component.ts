import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  rememberMe: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.authenticationService.getCurrentUser != null) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  getErrorMessage(field: string) {
    if (field === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
    }

    return this.password.hasError('required') ? 'You must enter a value' : '';
  }

  login(): void {
    this.isLoading = true;
    this.authenticationService.login(this.email.value, this.password.value, this.rememberMe)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error => {
          let message = 'ERROR: Login failed. Please try again.';
          if (error.status === 403) {
            message = 'ERROR: Login failed. Incorrect email or password. Please try again.';
          }

          this.snackBar.open(message, 'Dismiss');

          this.notificationService.error(`Login Failed`, message);
          this.isLoading = false;
        });
  }
}

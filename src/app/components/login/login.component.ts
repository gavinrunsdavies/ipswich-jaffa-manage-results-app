import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit() {
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
    this.authenticationService.login(this.email.value, this.password.value)
      .subscribe(
        data => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error => {
          let message = 'ERROR: Login failed. Please try again.';
          if (error.status === 403) {
            message = 'ERROR: Incorrect email or password.';
            message += ' <a href="https://www.ipswichjaffa.org.uk/wp-login.php?action=lostpassword">Lost your password?</a>';
          }

          this.notificationService.error(message);
          this.isLoading = false;
        });
  }
}

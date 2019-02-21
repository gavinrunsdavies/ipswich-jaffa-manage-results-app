import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription ,  Subject } from 'rxjs';

import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  title = 'Ipswich JAFFA Manage Results';
  displayName = '';

  userStatusSubscription: Subscription;
  loading = false;
  currentUser: User;
  model: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private notificationService: NotificationService) {
    this.userStatusSubscription = this.authenticationService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = (user != null);
    });
  }

  logout(): void {
    const message = `User ${this.currentUser.displayName} successfully logged out`;
    this.authenticationService.logout();
    this.notificationService.success(message);
  }
}

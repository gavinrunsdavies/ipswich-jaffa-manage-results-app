import { Component, OnInit } from '@angular/core';
import { NotificationService } from './../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  message: any;

  constructor(public notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.getMessages().subscribe(message => {
      this.message = message;
      const timeout = 5000;

      setTimeout(() => this.message = null, timeout);
    });
  }
}

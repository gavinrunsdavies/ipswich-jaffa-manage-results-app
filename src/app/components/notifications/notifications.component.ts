import { Component, OnInit } from '@angular/core';
import { NotificationService } from './../../services/notification.service';
import { LogMessage } from 'src/app/models/log-message';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  messages: LogMessage[] = [];

  constructor(public notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.getMessages().subscribe(message => {
      this.messages.unshift(message);
    });
  }
}

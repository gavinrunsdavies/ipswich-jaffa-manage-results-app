import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LogMessage } from 'src/app/models/log-message';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private messages = new Subject<LogMessage>();

    constructor(private router: Router) {
    }

    info(title: string, message: string) {
        const log = new LogMessage();
        log.type = 'notification_important';
        log.message = message;
        log.title = title;
        log.date = new Date();
        log.source = '';
        this.messages.next(log);
    }

    warning(title: string, message: string) {
        const log = new LogMessage();
        log.type = 'warning';
        log.message = message;
        log.title = title;
        log.date = new Date();
        log.source = '';

        this.messages.next(log);
    }

    error(title: string, message: string) {
        const log = new LogMessage();
        log.type = 'error';
        log.message = message;
        log.title = title;
        log.date = new Date();
        log.source = '';

        this.messages.next(log);
    }

    getMessages(): Observable<any> {
        return this.messages.asObservable();
    }
}

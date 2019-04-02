import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private messages = new Subject<any>();

    constructor(private router: Router) {
    }

    info(title: string, message: string) {
        this.messages.next({ type: 'info', text: message, title });
    }

    warning(title: string, message: string) {
        this.messages.next({ type: 'warning', text: message, title });
    }

    error(title: string, message: string) {
        this.messages.next({ type: 'error', text: message, title });
    }

    getMessages(): Observable<any> {
        return this.messages.asObservable();
    }
}

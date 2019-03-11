import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';

@NgModule({
    imports: [
        CommonModule,
        NotificationsRoutingModule
    ],
    declarations: [NotificationsComponent]
})
export class NotificationsModule {}

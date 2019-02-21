import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';

@NgModule({
    imports: [
        CommonModule,
        EventsRoutingModule
    ],
    declarations: [EventsComponent]
})
export class EventsModule {}

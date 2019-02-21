import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RacesRoutingModule } from './races-routing.module';
import { RacesComponent } from './races.component';

@NgModule({
    imports: [
        CommonModule,
        RacesRoutingModule
    ],
    declarations: [RacesComponent]
})
export class RacesModule {}

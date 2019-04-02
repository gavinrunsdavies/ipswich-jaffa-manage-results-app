import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LeaguesRoutingModule } from './leagues-routing.module';
import { LeaguesComponent } from './leagues.component';

@NgModule({
    imports: [
        CommonModule,
        LeaguesRoutingModule
    ],
    declarations: [LeaguesComponent]
})
export class RacesModule {}

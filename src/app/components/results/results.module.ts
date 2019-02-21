import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';

@NgModule({
    imports: [
        CommonModule,
        ResultsRoutingModule
    ],
    declarations: [ResultsComponent]
})
export class ResultsModule {}

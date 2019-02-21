import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RunnersRoutingModule } from './runners-routing.module';
import { RunnersComponent } from './runners.component';

@NgModule({
    imports: [
        CommonModule,
        RunnersRoutingModule
    ],
    declarations: [RunnersComponent]
})
export class RunnersModule {}

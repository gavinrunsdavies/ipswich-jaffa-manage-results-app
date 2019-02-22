import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatPaginatorModule, MatSortModule, MatTableModule, MatFormFieldModule, MatInputModule  } from '@angular/material';

import { RunnersRoutingModule } from './runners-routing.module';
import { RunnersComponent } from './runners.component';

@NgModule({
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        RunnersRoutingModule
    ],
    declarations: [RunnersComponent]
})
export class RunnersModule { }

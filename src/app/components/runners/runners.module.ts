import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatPaginatorModule, MatSortModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule  } from '@angular/material';

import { ResultsService } from '../../services/results.service';
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
        MatProgressSpinnerModule,
        MatIconModule,
        MatSnackBarModule,
        RunnersRoutingModule
    ],
    declarations: [RunnersComponent],
    providers: [
        ResultsService
    ]
})
export class RunnersModule { }

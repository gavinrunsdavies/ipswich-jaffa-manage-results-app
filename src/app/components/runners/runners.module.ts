import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, MatSortModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatButtonModule, MatDatepickerModule,
    MatRadioModule, MatNativeDateModule, MatDialogModule
  } from '@angular/material';

import { ResultsService } from '../../services/results.service';
import { RunnersRoutingModule } from './runners-routing.module';
import { RunnersComponent } from './runners.component';
import { RunnerEditorComponent } from './runner-editor/runner-editor.component';

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
        MatButtonModule,
        MatDatepickerModule,
        FormsModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatDialogModule,
        RunnersRoutingModule
    ],
    declarations: [RunnersComponent, RunnerEditorComponent],
    providers: [
        ResultsService
    ],
    entryComponents: [
        RunnerEditorComponent
    ]
})
export class RunnersModule { }

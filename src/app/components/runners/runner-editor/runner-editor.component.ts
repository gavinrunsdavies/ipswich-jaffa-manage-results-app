import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Runner } from '../../../models/runner';
import { ResultsService } from '../../../services/results.service';

@Component({
  selector: 'app-runner-editor',
  templateUrl: './runner-editor.component.html',
  styleUrls: ['./runner-editor.component.css']
})
export class RunnerEditorComponent implements OnInit {

  private runner: Runner;
  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private resultsService: ResultsService,
    public dialogRef: MatDialogRef<RunnerEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.runner = data.runner;
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close();
  }

}

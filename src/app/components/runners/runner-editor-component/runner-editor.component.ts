import { Component, Inject, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Runner } from '../../../models/runner';

@Component({
  selector: 'app-runner-editor',
  templateUrl: './runner-editor.component.html',
  styleUrls: ['./runner-editor.component.css']
})
export class RunnerEditorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RunnerEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public runner: Runner
  ) { }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Runner } from 'src/app/models/runner';
import { Gender } from 'src/app/models/gender';
import { ResultsService } from '../../../services/results.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-runner-editor',
  templateUrl: './runner-editor.component.html',
  styleUrls: ['./runner-editor.component.css']
})
export class RunnerEditorComponent implements OnInit {

  private runner: Runner;
  genders: Gender[];
  minDateOfBirth: Date;
  maxDateOfBirth: Date;
  formSubmittedIndicator = false;

  constructor(
    private resultsService: ResultsService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RunnerEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.runner = data.runner;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    this.minDateOfBirth = new Date(year - 120, month, day);
    this.maxDateOfBirth = new Date(year - 8, month, day);
  }

  ngOnInit() {
    this.getGenders();
  }

  getGenders() {
    this.resultsService.getGenders()
      .subscribe((genders: Gender[]) => {
        this.genders = genders;
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    console.log(`save called`);

    try {
      this.formSubmittedIndicator = true;
      this.resultsService.updateRunner(this.runner)
        .subscribe(
          runner => {
            this.notificationService.info(``, `Runner ${runner.name} updated to database`);
            this.formSubmittedIndicator = false;
            this.dialogRef.close();
          },
          error => {
            this.notificationService.error(`Update Failed`, `Failed to update runner ${this.runner.name} to database. Error ${error}`);
            this.formSubmittedIndicator = false;
          });
    } catch (e) {
      this.formSubmittedIndicator = false;
      this.notificationService.error(`Update Failed`, `Failed to update runner ${this.runner.name} to database. Error ${e}`);
      console.log('Error: ', e);
    }
  }

}

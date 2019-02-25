import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Runner } from 'src/app/models/runner';
import { Gender } from 'src/app/models/gender';
import { RunnerEditorComponent } from './runner-editor-component/runner-editor.component';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.css']
})
export class RunnersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'gender', 'dob', 'action'];
  dataSource: MatTableDataSource<Runner>;
  isLoading: boolean;
  runners: Runner[];
  genders: Gender[];
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  minDateOfBirth: Date;
  maxDateOfBirth: Date;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private resultsService: ResultsService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.runners);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    this.minDateOfBirth = new Date(year - 120, month, day);
    this.maxDateOfBirth = new Date(year - 8, month, day);
  }

  ngOnInit() {
    this.getRunners();
    this.getGenders();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRunners() {
    this.isLoading = true;
    this.resultsService.getRunners()
      .subscribe((runners: Runner[]) => {
        this.dataSource.data = runners;
        this.isLoading = false;
      });
  }

  getGenders() {
    this.resultsService.getGenders()
      .subscribe((genders: Gender[]) => {
        this.genders = genders;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(runnerId: number) {
    console.log(`delete(${runnerId}) called`);
    this.resultsService.deleteRunner(runnerId)
      .subscribe((runner: Runner) => {
        this.deleteRowDataTable(runnerId);
        this.snackBar.open(`Runner ${runner.name} successfully deleted.`, null, {
          duration: 1000
        });
      });
  }

  edit(runner: Runner) {
    // TODO get runner
    const dialogRef = this.dialog.open(RunnerEditorComponent, {
      width: '250px',
      // runner: runner
  });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
  });
  }

  add(runner: Runner) {
    console.log(`add(${runner.name}) called`);
  }

  private deleteRowDataTable(runnerId) {
    const itemIndex = this.dataSource.data.findIndex(obj => obj.id === runnerId);
    this.dataSource.data.splice(itemIndex, 1);
    this.dataSource.paginator = this.paginator; // TODO. Is this needed?
  }
}

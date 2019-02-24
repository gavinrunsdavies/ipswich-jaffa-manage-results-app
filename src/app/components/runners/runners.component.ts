import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';

import { Runner } from '../../models/runner';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.css']
})
export class RunnersComponent implements OnInit {
  displayedColumns: string[] = ['action', 'name', 'gender', 'dob'];
  dataSource: MatTableDataSource<Runner>;
  isLoading: boolean;
  runners: Runner[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private resultsService: ResultsService,
              private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(this.runners);
  }

  ngOnInit() {
    this.getRunners();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRunners(): void {
    this.isLoading = true;
    this.resultsService.getRunners()
      .subscribe(runners => {
        // this.runners = runners;
        this.dataSource.data = runners;
        this.isLoading = false;
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
    this.snackBar.open(`Runner  successfully deleted.`, '', {
      duration: 1000
    });
    // return;
    // //this.resultsService.deleteRunner(runnerId)
    //   .subscribe(runner => {
    //     this.snackBar.open(`Runner ${runner.name} successfully deleted.`, {
    //       duration: 1000
    //     });
    //   });
  }

  edit(runnerId: number) {

  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatMenuModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatGridListModule,
        MatCardModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {}

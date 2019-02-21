import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadChildren: '../dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'runners',
                loadChildren: '../runners/runners.module#RunnersModule'
            },
            {
                path: 'events',
                loadChildren: '../events/events.module#EventsModule'
            },
            {
                path: 'races',
                loadChildren: '../races/races.module#RacesModule'
            },
            {
                path: 'results',
                loadChildren: '../results/results.module#ResultsModule'
            },
            {
                path: 'runner-of-the-month',
               // loadChildren: '../runner-of-the-month/runner-of-the-month.module#RunnerOfTheMonthModule'
            },
            {
                path: 'meetings',
                loadChildren: '../meetings/meetings.module#MeetingsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RacesComponent } from './Races.component';

const routes: Routes = [
    {
        path: '',
        component: RacesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RacesRoutingModule {}

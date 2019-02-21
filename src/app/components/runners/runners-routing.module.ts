import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RunnersComponent } from './Runners.component';

const routes: Routes = [
    {
        path: '',
        component: RunnersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RunnersRoutingModule {}

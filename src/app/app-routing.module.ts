import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnsureAuthenticatedService } from './services/ensure-authenticated.service';

const routes: Routes = [
  {
      path: '',
      loadChildren: './components/layout/layout.module#LayoutModule',
      canActivate: [EnsureAuthenticatedService]
  },
  {
      path: 'login',
      loadChildren: './components/login/login.module#LoginModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true } // <-- debugging purposes only. TODO Env variable?)],
  )],
  exports: [RouterModule],
  providers: [EnsureAuthenticatedService]
})
export class AppRoutingModule { }

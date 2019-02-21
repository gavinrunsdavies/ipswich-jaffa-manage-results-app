import { NgModule } from '@angular/core';

import {MatButtonModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatGridListModule,
 MatMenuModule, MatSidenavModule, MatListModule, MatIconRegistry } from '@angular/material';

@NgModule({
imports: [MatButtonModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatGridListModule,
 MatMenuModule, MatSidenavModule, MatListModule, MatIconRegistry
],
exports: [MatButtonModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatGridListModule,
 MatMenuModule, MatSidenavModule, MatListModule, MatIconRegistry]
})


export  class  MyMaterialModule { }

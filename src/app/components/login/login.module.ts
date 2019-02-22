import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatIconModule, MatFormFieldModule,
    MatProgressSpinnerModule } from '@angular/material';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        FormsModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}

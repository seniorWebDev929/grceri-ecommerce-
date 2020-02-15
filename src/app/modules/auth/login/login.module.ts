import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { LoginComponent } from './login.component';

// BOOTSTRAP
import { AlertModule } from 'ngx-bootstrap';

// SLIDER
import { Modules } from '../../../shared/widgets/widgets.module';

// SERVICES
import { AuthService, LoggedInService } from '../../../shared/services';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: LoginComponent, canActivate: [LoggedInService] }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(ROUTES),
		ReactiveFormsModule,
		AlertModule,
		Modules
	],
	declarations: [
		LoginComponent
	],
	exports: [
		LoginComponent
	],
	providers: [
		AuthService
	],
	entryComponents: [
		LoginComponent
	]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { CallbackComponent } from './callback.component';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: CallbackComponent }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(ROUTES)
	],
	declarations: [
		CallbackComponent
	],
	exports: [
		CallbackComponent
	]
})
export class CallbackModule { }

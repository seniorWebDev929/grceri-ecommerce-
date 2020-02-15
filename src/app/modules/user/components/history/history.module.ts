import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { HistoryComponent } from './history.component';

// LAZY
import { LazyLoadImageModule  } from 'ng-lazyload-image';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', component: HistoryComponent }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		BsDropdownModule,
		CommonModule,
		FormsModule,
		LazyLoadImageModule
	],
	declarations: [
		HistoryComponent
	],
	exports: [
		HistoryComponent
	],
	entryComponents: [
		HistoryComponent
	]
})
export class HistoryModule { }

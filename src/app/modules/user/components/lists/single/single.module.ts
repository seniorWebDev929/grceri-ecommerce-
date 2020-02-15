import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// ROUTER
import { RouterModule } from '@angular/router';

// FORMS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ListsSingleComponent } from './single.component';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

// MODULES
import { Modules } from '../../../../../shared/widgets/widgets.module';

// LAZY LOAD
import { LazyLoadImageModule } from 'ng-lazyload-image';

// ADSENSE
import { AdsenseModule } from 'ng2-adsense';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		AlertModule.forRoot(),
		AdsenseModule.forRoot(),
		LazyLoadImageModule,
		Modules
	],
	declarations: [
		ListsSingleComponent
	],
	exports: [
		ListsSingleComponent
	],
	entryComponents: [
		ListsSingleComponent
	],
	providers: [
		DatePipe
	]
})
export class ListsSingleModule { }

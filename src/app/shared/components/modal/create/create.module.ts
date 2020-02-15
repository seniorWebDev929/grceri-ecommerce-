import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ListsCreateComponent } from './create.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule
	],
	declarations: [
		ListsCreateComponent
	],
	exports: [
		ListsCreateComponent
	],
	entryComponents: [
		ListsCreateComponent
	]
})
export class ListsCreateModule { }

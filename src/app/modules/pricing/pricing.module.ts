import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { PricingComponent } from './pricing.component';
import { PricingEliteComponent } from './components/elite/elite.component';
import { PricingBasicComponent } from './components/basic/basic.component';
import { PricingFreeComponent } from './components/free/free.component';

// FORMS
import { FormsModule } from '@angular/forms';

// routes
export const ROUTES: Routes = [
	{ path: '', component: PricingComponent },
	{ path: 'free', component: PricingFreeComponent },
	{ path: 'basic', component: PricingBasicComponent },
	{ path: 'elite', component: PricingEliteComponent }
];

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		FormsModule
	],
	declarations: [
		PricingComponent,
		PricingFreeComponent,
		PricingBasicComponent,
		PricingEliteComponent
	],
	exports: [
		PricingComponent,
		PricingFreeComponent,
		PricingBasicComponent,
		PricingEliteComponent
	],
	entryComponents: [
		PricingComponent
	]
})
export class PricingModule { }

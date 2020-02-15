import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// SLIDER
import { Ng5SliderModule } from 'ng5-slider';

// FORMGROUP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SidebarComponent } from './sidebar.component';

// CHILDREN
import { DepartmentComponent } from './department/department.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { SliderChartComponent } from './slider-chart/slider-chart.component';

// RATING
import { BarRatingModule } from 'ngx-bar-rating';

// NG4 CHARTS
import { ChartsModule } from 'ng4-charts/ng4-charts';

// ADSENSE
import { AdsenseModule } from 'ng2-adsense';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		BarRatingModule,
		Ng5SliderModule,
		ChartsModule,

		// ADSENSE
		AdsenseModule.forRoot()
	],
	declarations: [
		SidebarComponent,
		DepartmentComponent,
		DynamicComponent,
		SliderChartComponent
	],
	exports: [
		SidebarComponent,
		DepartmentComponent,
		DynamicComponent
	],
	entryComponents: [
		SidebarComponent,
		DynamicComponent,
		DepartmentComponent
	]
})
export class SidebarModule { }

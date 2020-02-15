import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// RELATED
import { ListsComponent } from './lists.component';
import { ListsTileModule } from './tile/tile.module';
import { ListsSingleModule } from './single/single.module';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// AUTH
import { AuthGuardService } from '../../../../shared/services';

// ROUTER
import { ListsSingleComponent } from './single/single.component';

export const ROUTES: Routes = [
	{ path: '', component: ListsComponent, canActivate: [AuthGuardService] },
	{ path: 'following', component: ListsComponent, canActivate: [AuthGuardService] },
	{ path: 'discover', component: ListsComponent },
	{ path: ':id', component: ListsSingleComponent }
]

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		FormsModule,
		ListsTileModule,
		ListsSingleModule,
		BsDropdownModule.forRoot()
	],
	declarations: [
		ListsComponent
	],
	exports: [
		ListsComponent
	],
	entryComponents: [
		ListsComponent
	]
})
export class ListsModule { }

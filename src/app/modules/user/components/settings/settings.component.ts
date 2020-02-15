import { Component, OnDestroy } from '@angular/core';

// SERVICES
import { HttpCancelService } from '../../../../shared/services';

// ROUTER
import { Router } from '@angular/router';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'settings',
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.scss']
})

// CLASS
export class SettingsComponent implements OnDestroy {

	constructor(private httpCancelService: HttpCancelService) { }

	ngOnDestroy() {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}
}

import { Component } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'settings-billing-payment',
	templateUrl: 'payment.component.html'
})

// CLASS
export class SettingsBillingPaymentComponent {

	constructor(
		title: Title) {
		title.setTitle('History - grceri');
	}
}

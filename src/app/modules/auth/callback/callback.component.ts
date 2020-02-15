import { Component, OnInit } from '@angular/core';

// SERVICES
import { AuthService } from '../../../shared/services';

// SEO
import { Meta } from '@angular/platform-browser';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'callback',
	templateUrl: 'callback.component.html',
})

// CLASS
export class CallbackComponent implements OnInit {

	constructor(
		private meta: Meta,
		private AS: AuthService) {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
	}

	ngOnInit() {
		this.AS.handleAuthentication();
	}

}

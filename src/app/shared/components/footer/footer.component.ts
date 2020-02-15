import { Component } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { GoogleAnalyticsService, AuthService, InstallPWAService } from '../../services';

// ENV
import { environment } from '../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'footer-app',
	templateUrl: 'footer.component.html',
	styleUrls: ['footer.component.scss']
})
export class FooterComponent {
	d = new Date();

	env = environment;

	constructor(
		public IS: InstallPWAService,
		public AS: AuthService,
		public GS: GoogleAnalyticsService,
		public router: Router) {}
}

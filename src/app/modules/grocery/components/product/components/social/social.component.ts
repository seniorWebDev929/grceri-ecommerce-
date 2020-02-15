import { Component, Input } from '@angular/core';

// SERVICE
import { SocialService, DeviceService } from '../../../../../../shared/services';

// INTERFACES
import { IProductDetails } from '../../../../../../shared/interfaces';

// ROUTER
import { Router } from '@angular/router';

// SHARE
import { NgNavigatorShareService } from 'ng-navigator-share';

// CORDOVA
declare var navigator: any;

@Component({
	selector: 'product-social',
	templateUrl: 'social.component.html',
	styleUrls: ['social.component.scss']
})
export class ProductSocialComponent {
	@Input() meta: IProductDetails;

	private navigator: NgNavigatorShareService;

	constructor(
		public NSS: NgNavigatorShareService,
		private router: Router,
		private DS: DeviceService,
		private SS: SocialService) {
		this.navigator = NSS;
	}

	social(a) {
		return this.SS.social(a, this.meta, 'product', this.router.url);
	}

	share() {
		if (this.DS.isMobile) {
			navigator.share({
				title: this.meta.title,
				text: this.meta.description,
				url: 'http://grceri.com' + this.router.url
			}).then((response) => {
				console.log(response);
			}).catch((error) => {
				console.log(error);
			});
		} else {
			this.navigator.share({
				title: this.meta.title,
				text: this.meta.description,
				url: 'http://grceri.com' + this.router.url
			}).then((response) => {
				console.log(response);
			}).catch((error) => {
				console.log(error);
			});
		}
	}
}

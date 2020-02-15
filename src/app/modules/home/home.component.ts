import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// COMPONENT
import { ItemComponent } from '../../shared/components/item/item.component';

// SERVICES
import { AuthService, HttpCancelService, CategoryAPIService, SeoService, GoogleAnalyticsService, BarcodeService, InstallPWAService } from '../../shared/services';

// ENV
import { environment } from '../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'home-app',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})

// CLASS
export class HomeComponent implements OnInit, OnDestroy {
	moreC = false;

	searchInputText: any;
	category: any;
	load = require('../../../assets/img/blank.jpg');

	// CMS
	latest: any;

	// S - DATA
	schema = {
		'@context': 'http://schema.org',
		'@type': 'WebSite',
		'url': 'https://grceri.com/',
		'potentialAction': {
			'@type': 'SearchAction',
			'target': 'https://grceri.com/search?cat_id=&query={search_term_string}',
			'query-input': 'required name=search_term_string'
		}
	}

	env = environment;

	constructor(
		public IS: InstallPWAService,
		public BS: BarcodeService,
		public GS: GoogleAnalyticsService,
		public router: Router,
		private AS: AuthService,
		private IC: ItemComponent,
		@Inject(PLATFORM_ID) private platform: any,
		private CS: CategoryAPIService,
		private SS: SeoService,
		private httpCancelService: HttpCancelService) {
		// SEO
		this.SS.generateTags({
			title: 'Online Grocery Shopping Store | Online Grocery Database - grceri',
			description: 'Shop Online for best Grocery products like Baking, beverages, coffee, frozen food, Condiments, Sauces & spices, Gift baskets, Gluten Free, International, and kosher foods.',
			url: this.router.url
		});

		this.searchInputText = '';
	}

	ngOnInit() {
		this.list();
		// this.products();
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	login() {
		return this.AS.isAuthenticated();
	}

	list() {
		this.CS.getCat().subscribe(r => {
			if (r) {
				this.category = r && r[0] && r[0]['categories'] ? r[0]['categories'] : null;
			}
		});
	}

	onNewInput(input) {
		if (input === this.searchInputText) {
			this.searchInputText = input + '*##1*1##*';
		} else {
			this.searchInputText = input;
		}
	}

	url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	moreCat() {
		this.moreC = !this.moreC;
	}

	lower(i) {
		return i.toLowerCase();
	}

	product(i) {
		return this.IC.product(i);
	}

	gEvent(name) {
		this.GS.event('image', `Home - ${name} (Category)`, 'click', 0);
	}
}

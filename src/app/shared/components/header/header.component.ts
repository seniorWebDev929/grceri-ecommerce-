import { Component, OnInit, HostListener, PLATFORM_ID,
				 Inject, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

// SERVICES
import { AuthService, CategoryAPIService, GoogleAnalyticsService, InstallPWAService } from '../../../shared/services';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'header-app',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	// OBJECT
	lists: any;
	profile: any;
	classList: any[] = [];

	// BOOLEAN
	other = false;
	clear = false;
	navIsFixed = false;
	expanded: boolean;
	isCategoriesDropdownHidden = true;
	sideNav = false;

	// STRING
	currentUrl: any = '';
	searchInputText: string;

	// MOBILE
	mobile: boolean;

	// PAGE
	disableHeaderSearch: boolean;

	// SUBSCRIPTION
	routerSubscription: Subscription;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public GS: GoogleAnalyticsService,
		private AS: AuthService,
		public router: Router,
		private location: Location,
		public activatedRoute: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private CS: CategoryAPIService,
		private changeDetector: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platform: any
	) {
		this.searchInputText = '';
		this.isMobile();
		this.disableHeaderSearch = false;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.resetNav();
		this.isMobile();
	}

	ngAfterViewInit() {
		this.isMobile();
		this.changeDetector.detectChanges();
	}

	ngOnDestroy() {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}

	private isMobile() {
		if (isPlatformBrowser(this.platform)) {
			this.mobile = (window.innerWidth < 767) ? true : false;
		}
	}

	onNewInput(input) {
		if (input === this.searchInputText) {
			this.searchInputText = input + '*##1*1##*';
		} else {
			this.searchInputText = input;
		}
	}

	logOut() {
		this.AS.logout();
	}

	login() {
		return this.AS.isAuthenticated();
	}

	isUser(value: string): boolean {
		return /^\/user(\/|$)/.test(value);
	}

	private url(i) {
		return i['name'].toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}

	ngOnInit() {
		this.checkCurrentRoute();
		this.list();
		if (this.AS.userProfile) {
			this.profile = this.AS.userProfile;
		} else {
			if (this.AS.isAuthenticated()) {
				this.AS.getProfile((err, profile) => {
					this.profile = profile;

					if (err) {
						this.router.navigate(['/login']);
					}
				});
			}
		}
	}

	checkCurrentRoute() {
		this.routerSubscription = this.router.events.subscribe((val) => {
			let currentURL = this.location.path();
			if (currentURL.indexOf('/groceries/') !== -1) {
				this.disableHeaderSearch = true;
			} else if (currentURL.indexOf('/search?') !== -1) {
				this.disableHeaderSearch = true;
			} else {
				this.disableHeaderSearch = false;
			}
		});
	}

	isStripe(value: string): boolean {
		let boolean: boolean;
		if (
			value === '/'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}

	list() {
		this.CS.getCat().subscribe((r) => {
			if (r) {
				this.lists = r[0]['categories'];
			}
		});
	}

	gEvent(name) {
		this.GS.event('link', `Header - ${name} (Category)`, 'click', 0);
	}

	resetNav() {
		this.sideNav = false;
		this.document.body.classList.remove('is-active');
	}

	addNav() {
		this.sideNav = true;
		this.document.body.classList.add('is-active');
	}
}

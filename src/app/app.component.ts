import {
	Component, ViewEncapsulation, OnInit, AfterViewInit, Inject, ViewChild,
	ChangeDetectorRef, HostListener, PLATFORM_ID, EventEmitter
} from '@angular/core';

import { isPlatformBrowser, DOCUMENT } from '@angular/common';

// SEO
import { Meta } from '@angular/platform-browser';

// ROUTER
import { Router, NavigationEnd } from '@angular/router';

// SERVICES
import { LinkTagService, AuthService, SearchBarService, CategoryAPIService, BarcodeService, InstallPWAService, DeviceService } from './shared/services';

// ENV
import { environment } from '../environments/environment';

// GA
declare let ga: Function;

// CORDOVA
declare var admob: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
	mobile: boolean;

	// EVENTS
	mobileSubscription = new EventEmitter<boolean>(true);

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this._isMobile();
	}

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(DOCUMENT) private document: Document,
		private changeDetector: ChangeDetectorRef,
		public BS: BarcodeService,
		public router: Router,
		private TS: LinkTagService,
		public AS: AuthService,
		public CS: CategoryAPIService,
		private SBS: SearchBarService,
		private meta: Meta,
		private IS: InstallPWAService,
		private DS: DeviceService
	) {
		this.meta.addTags([{ name: 'author', content: 'Grceri' }]);

		this.IS.startPrompt();
		this._catInformation();
		this._adMob();
		this._appLogic();
	}

	ngOnInit() {
		this._loader();
		this._isMobile();
		this._meta();
	}

	ngAfterViewInit() {
		this._analytics();
		this._lazyLoadScripts();
		this.changeDetector.detectChanges();
	}

	isHeaderURLS(value: string): boolean {
		let boolean: boolean;
		if (
			value.startsWith('/callback') !== true &&
			value !== '/sign-up' &&
			value !== '/sign-up/basic' &&
			value !== '/sign-up/elite' &&
			value !== '/login' &&
			value !== '/forgot-password'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}

	isFooterURLS(value: string): boolean {
		let boolean: boolean;
		if (
			value.startsWith('/callback') !== true &&
			value !== '/sign-up' &&
			value !== '/sign-up/basic' &&
			value !== '/sign-up/elite' &&
			value !== '/register' &&
			value !== '/login' &&
			value !== '/forgot-password'
		) {
			boolean = true;
		} else {
			boolean = false;
		}

		return boolean;
	}

	private _catInformation() {
		this.CS.processCategoriesAPI().subscribe(res => res);
	}

	private _lazyLoadScripts() {
		const head = this.document.getElementsByTagName('head')[0];

		let anlyticsLink = this.document.getElementById('anlytics_script') as HTMLScriptElement;
		if (!anlyticsLink) {
			const link0 = this.document.createElement('link');
			const link2 = this.document.createElement('link');
			const link3 = this.document.createElement('link');
			const link4 = this.document.createElement('link');
			const link5 = this.document.createElement('link');
			const link6 = this.document.createElement('link');
			const script0 = this.document.createElement('script');
			const script1 = this.document.createElement('script');
			const script2 = this.document.createElement('script');
			const script3 = this.document.createElement('script');
			const script4 = this.document.createElement('script');
			const script5 = this.document.createElement('script');
			const script6 = this.document.createElement('script');

			link0.rel = 'preconnect';
			link2.rel = 'preconnect';
			link3.rel = 'preconnect';
			link4.rel = 'preconnect';
			link5.rel = 'preconnect';
			link6.rel = 'manifest';

			link0.setAttribute('crossorigin', '');
			link2.setAttribute('crossorigin', '');
			link3.setAttribute('crossorigin', '');
			link4.setAttribute('crossorigin', '');
			link5.setAttribute('crossorigin', '');

			script5.setAttribute('type', 'application/ld+json');
			script6.setAttribute('type', 'text/javascript');

			link0.href = 'https://www.google.com';
			link2.href = 'https://googleads.g.doubleclick.net';
			link3.href = 'https://stats.g.doubleclick.net';
			link4.href = 'https://www.google-analytics.com';
			link5.href = 'https://grceri-api-prod.azurewebsites.net';
			link6.href = 'manifest.json';

			script0.id = 'ads_script';
			script1.id = 'anlytics_script';
			script2.id = 'g_script';
			script3.id = 'cordova_back';
			script4.id = 'cordova';
			script5.id = 'schema_org';
			script6.id = 'ga_code';

			// GOOGLE
			script0.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
			script1.src = 'https://www.google-analytics.com/analytics.js';
			script2.innerHTML = `(function (i, s, o, g, r, a, m) {i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date();})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');ga('create', 'UA-119163290-1', 'auto');`;

			// CORDOVA
			script3.innerHTML = `window.addEventListener = function () {	EventTarget.prototype.addEventListener.apply(this, arguments);};window.removeEventListener = function () {	EventTarget.prototype.removeEventListener.apply(this, arguments);};document.addEventListener = function () {	EventTarget.prototype.addEventListener.apply(this, arguments);};document.removeEventListener = function () {	EventTarget.prototype.removeEventListener.apply(this, arguments);};`;
			script4.src = 'cordova.js';

			// STRUCTURED DATA
			script5.innerHTML = `{"@context": "https://schema.org","@type": "Organization","url": "https://www.grceri.com","logo": "https://www.grceri.com/assets/svg/logo.svg"}`;

			// GA CODE
			script6.innerHTML = `window['GoogleAnalyticsObject'] = 'ga';
			window['ga'] = window['ga'] || function() {
				(window['ga'].q = window['ga'].q || []).push(arguments)
			};`;

			if (!this.DS.isMobile) {
				head.appendChild(link2);
				head.appendChild(link3);
				head.appendChild(link6);
				head.appendChild(script0);
				head.appendChild(script5);
			};

			if (environment.mobile) {
				head.appendChild(script3);
				head.appendChild(script4);
			}

			head.appendChild(script6);
			head.appendChild(script1);
			head.appendChild(script2);
			head.appendChild(link4);
		}
	}

	private _isMobile() {
		if (isPlatformBrowser(this.platform)) {
			this.mobile = (window.innerWidth < 767) ? true : false;

			this.SBS.mobile = this.mobile;
			if (!this.SBS.mobile) {
				this.SBS.disableSeachPopup();
			}
		}
	}

	private _meta() {
		this.router.events.filter(event => event instanceof NavigationEnd).subscribe((res: NavigationEnd) => {
			if (isPlatformBrowser(this.platform)) {
				window.scrollTo(0, 0);
			}

			if (!this.DS.isMobile) {
				this.TS.updateTag({ rel: 'canonical', href: 'https://grceri.com${res.url}' });
			}

			if (this.mobile) {
				if (isPlatformBrowser(this.platform)) {
					this._redirectoApp(res.url);
				};
			}
		});
	}

	private _analytics() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
				ga('set', 'page', event.urlAfterRedirects);
				ga('send', 'pageview');
			}
		});
	}

	private _adMob() {
		if (this.DS.isMobile) {
			this.document.addEventListener('deviceready', () => {
				admob.banner.show({
					id: {
						android: 'ca-app-pub-3783664105032363/4129410911'
					}
				});
				admob.interstitial.load({
					id: {
						android: 'ca-app-pub-3783664105032363/1750659580'
					},
				}).then(() => admob.interstitial.show());
			});
		};
	}

	private _loader() {
		// VARIABLES
		let d = this.document.getElementById('root');
		let e = `<div class="fp-loader"><img src="assets/svg/cart.svg" alt="logo" /><div class="progress"><div class="indeterminate"></div></div></div>`;

		// IF NOT MOBILE
		if (environment.mobile) {
			if (this.document.getElementsByClassName('fp-loader')[0]) {
				this.document.getElementsByClassName('fp-loader')[0]
			}
		} else {
			if (this.document.getElementsByClassName('fp-loader')[0] === undefined) {
				// ADD LOADER
				d.insertAdjacentHTML('afterend', e);

				// ADD LOADED
				d.setAttribute('class', 'loaded');

				// REMOVE AFTER DONE
				setTimeout(() => {
					d.removeAttribute('id');
					d.removeAttribute('class');

					this.document.getElementsByClassName('fp-loader')[0].remove();
				}, 2000);
			}
		}
	}

	private _redirectoApp(url) {
		let a = url !== '/' ? `?path='${url}` : '';

		if (this.mobile) {
			window.location.href = `intent://#Intent;package=com.grceri;scheme=grceri${a};end;`;
		}
	}

	private _appLogic() {
		let a = this.document.getElementsByName('app-root')[0];

		if (environment.mobile) {
			a.setAttribute('class', 'mobile');
		}
	}
}

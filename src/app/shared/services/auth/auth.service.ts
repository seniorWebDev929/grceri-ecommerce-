import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

// RXJS
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

// ROUTER
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

// HTTP
import { Http } from '@angular/http';


// SERVICES
import { LocalStorage } from '../local-storage/local-storage.service';

// AUTH
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
	refreshSub: any;
	userProfile: any;
	refreshSubscription: any;
	renew: boolean;
	// url = environment.production ? 'https://grceri.com' : this.document.location.origin;
	url = this.document.location.origin;

	auth0 = new auth0.WebAuth({
		clientID: '96b0aXJKxvJRK4gYKR0YuJnEnXN8cJsE',
		domain: 'grceri-auth.auth0.com',
		audience: `https://grceri-auth.auth0.com/userinfo`,
		redirectUri: this.url + '/callback',
		responseType: 'token id_token',
		scope: 'openid profile user_metadata'
	});

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		@Inject(DOCUMENT) private document: Document,
		private LS: LocalStorage,
		private router: Router,
		private sanitizer: DomSanitizer,
		private http: Http) {
	}

	public login(email: string, password: string, renew?: boolean): Observable<string> {
		let a = Observable.create(observer => {

			this.auth0.login(
				{
					realm: 'mssql',
					email,
					password
				},
				(err, authResult) => {
					if (err) {
						observer.next(err);
					}
					observer.complete();
				}
			);
		});

		return a;
	}

	public signup(email: string, password: string, options?: object) {
		let a = new Promise((resolve, reject) => {
			this.auth0.signup({
				connection: 'mssql',
				email,
				password,
				user_metadata: options
			},
				(err, authResult) => {
					if (err) {
						reject(err.message);
					} else {
						resolve(authResult);
					}
				});
		});

		return a;
	}

	public resetPassword(email: string) {
		let a = new Promise((resolve, reject) => {
			this.auth0.changePassword({
				connection: 'mssql',
				email
			}, function (err, resp) {
				if (err) {
					reject(err.message);
				} else {
					resolve(resp);
				}
			});
		})

		return a;
	}

	public handleAuthentication(): void {
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
			} else if (err) {
				this.router.navigate(['/login']);
				alert(`Error: ${err.error}. Check the console for further details.`);
			}
		});
	}

	private setSession(authResult, renew?): void {
		// Set the time that the access token will expire at
		const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

		this.LS.set('access_token', authResult.accessToken);
		this.LS.set('id_token', authResult.idToken);
		this.LS.set('userId', authResult.idTokenPayload.sub.replace('auth0|', ''));
		this.LS.set('expires_at', expiresAt);

		if (renew) {
			this.scheduleRenewal();
		}

		if (isPlatformBrowser(this.platform)) {
			if (window.localStorage.getItem('authRedirect') === null) {
				this.router.navigate(['/']);
			} else {
				this.router.navigate([window.localStorage.getItem('authRedirect')]);
			}
		}

		this._clearRedirect();
	}

	public scheduleRenewal() {
		if (!this.isAuthenticated()) { return; }
		this.unscheduleRenewal();

		if (isPlatformBrowser(this.platform)) {
			const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
			const expiresIn$ = Observable.of(expiresAt).pipe(
				mergeMap(
					// tslint:disable-next-line:no-shadowed-variable
					expiresAt => {
						const now = Date.now();
						// Use timer to track delay until expiration
						// to run the refresh at the proper time
						return Observable.timer(Math.max(1, expiresAt - now));
					}
				)
			);

			// Once the delay time from above is
			// reached, get a new JWT and schedule
			// additional refreshes
			this.refreshSub = expiresIn$.subscribe(
				() => {
					this.renewToken();
					this.scheduleRenewal();
				}
			);
		};
	}

	private _clearRedirect() {
		// Remove redirect from localStorage
		return this.LS.remove('authRedirect');
	}

	private _clearOldNonces() {
		if (isPlatformBrowser(this.platform)) {
			Object.keys(localStorage).forEach(key => {
				if (!key.startsWith('com.auth0.auth')) { return; }
				this.LS.remove(key);
			});
		}
	}

	public unscheduleRenewal() {
		if (this.refreshSub) {
			this.refreshSub.unsubscribe();
		}
	}

	public renewToken() {
		this.auth0.checkSession({}, (err, result) => {
			if (err) {
				if (!environment.production) {
					console.log(err);
				}
			} else {
				this.setSession(result);
			}
		});
	}


	public logout(): void {
		// Remove tokens and expiry time from localStorage
		this.LS.remove('access_token');
		this.LS.remove('id_token');
		this.LS.remove('userId');
		this.LS.remove('expires_at');

		this._clearOldNonces();
		this._clearRedirect();

		// Go back to the home route
		this.router.navigate(['/']);
	}

	public isAuthenticated(): boolean {
		// Check whether the current time is past the
		// access token's expiry time
		if (isPlatformBrowser(this.platform)) {
			const expiresAt = localStorage.getItem('expires_at') ? JSON.parse(localStorage.getItem('expires_at')) : new Date().getTime();
			return new Date().getTime() < expiresAt;
		}
	}

	public getProfile(cb): void {
		let access_token = this.LS.get('access_token');
		if (access_token) {
			const self = this;
			this.auth0.client.userInfo(access_token, (err, profile) => {
				if (profile) {
					self.userProfile = profile;
				}
				cb(err, profile);
			});
		}

	}
}

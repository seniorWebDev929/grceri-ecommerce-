import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { LocalStorage, UserAPIService, HttpCancelService, ModalService, AuthService, ShoppingListAPIService } from '../../../../shared/services';

// ROUTER
import { Router } from '@angular/router';

// SUBSCRIPTIONS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'lists',
	templateUrl: 'lists.component.html',
	styleUrls: ['lists.component.scss']
})

// CLASS
export class ListsComponent implements OnInit, OnDestroy {
	// OBJECT
	lists = [];
	section = [];
	config = {
		class: 'modal-popup',
		animated: false,
		backdrop: true
	};

	// NUMBER
	id: number = this.LS.get('userId');

	// STRING
	name = 'My Lists';
	url: string;

	// BOOLEAN
	loading = false;

	// ARRAY
	nitems = Array(10).fill(1);

	// SUBSCRIPTIONS
	discoverListSusbscription: Subscription;
	followedListSubscription: Subscription;
	listsSubscription: Subscription;

	constructor(
		private router: Router,
		public AS: AuthService,
		public MS: ModalService,
		private LS: LocalStorage,
		private SLS: ShoppingListAPIService,
		private meta: Meta,
		private title: Title,
		private httpCancelService: HttpCancelService) {
	}

	ngOnInit() {
		if (!this.AS.isAuthenticated()) {
			this.router.navigate(['/login']);
		}

		this.MS.data$.next(undefined);
		this._getLists();
		this.refreshUserLists();
	}

	ngOnDestroy() {
		if (this.discoverListSusbscription) {
			this.discoverListSusbscription.unsubscribe();
		}
		if (this.listsSubscription) {
			this.listsSubscription.unsubscribe();
		}
		if (this.followedListSubscription) {
			this.followedListSubscription.unsubscribe();
		}

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private refreshUserLists() {
		this.MS.fetchModalData().subscribe(res => {
			if (res && res.type === 'success' && res.value === 'List has been successfully created.') {
				this._getLists();
			}
		}, error => error);
	}

	private _getLists() {
		this.url = this.router.url;

		if (this.url === '/lists/discover') {
			// TITLE
			this.name = 'Discover Lists';
			this.loading = true;

			this.discoverListSusbscription = this.SLS.getDiscoverLists().subscribe((res) => {
				this.lists = res;
			},
				(err) => {
					if (!environment.production) {
						console.log('an error has occured', err);
					}

					this.loading = false;
					this.lists = [];
				},
				() => {
					this.loading = false;

					if (!environment.production) {
						console.log('discovered lists', this.lists);
					}
				});
		}

		if (this.id) {
			if (this.url === '/lists') {
				// TITLE
				this.name = 'My Lists';
				this.loading = true;

				this.listsSubscription = this.SLS.getLists(this.id).subscribe((res) => {
					this.lists = res;
				},
					(err) => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						this.loading = false;
						this.lists = [];
					},
					() => {
						this.loading = false;

						if (!environment.production) {
							console.log('lists', this.lists);
						}
					});
			}
			if (this.url === '/lists/following') {
				// TITLE
				this.name = 'My Following Lists';
				this.loading = true;

				this.followedListSubscription = this.SLS.getFollowedLists(this.id).subscribe((res) => {
					this.lists = res;
				},
					(err) => {
						if (!environment.production) {
							console.log('an error has occured', err);
						}

						this.loading = false;
						this.lists = [];
					},
					() => {
						this.loading = false;

						if (!environment.production) {
							console.log('followed lists', this.lists);
						}
					});
			}
		} else {
			this.lists = [];
		}

		if (this.url === '/lists' || this.url === '/lists/following') {
			// META
			this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		}

		// META
		this.title.setTitle(`${this.name} - grceri`);
	}
}

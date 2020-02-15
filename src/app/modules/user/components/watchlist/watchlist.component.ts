import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { LocalStorage, ModalService, HttpCancelService, UserAPIService, SortingService } from '../../../../shared/services';

// RXJS
import { Subscription } from 'rxjs';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'watchlist',
	templateUrl: 'watchlist.component.html',
	styleUrls: ['watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');

	// SUBSCRIPTIONS
	subscriptions: any;

	// ARRAY
	nitems = Array(10).fill(1);
	message: Array<object> = [];

	// BOOLEAN
	loading = true;

	// OBJECT
	watchlists = [];
	bookmarkList: any[] = [];

	constructor(
		private US: UserAPIService,
		private LS: LocalStorage,
		private meta: Meta,
		private title: Title,
		public SS: SortingService,
		private MS: ModalService,
		private httpCancelService: HttpCancelService) {
			this.subscriptions = new Subscription();
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My Watchlists - grceri');
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this.getWatchlists();
		this.fetchModalMessage();
		this.getSavedProducts();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private fetchModalMessage(): void {
		this.subscriptions.add(this.MS.fetchModalData().subscribe(res => {
			if (res) {
				if (res.type === 'delete-watchlist-item' && res.value) {
					this.message = [];
					this._message('success', res.value, res.linkTitle, res.listId);
					this.getWatchlists();
				} else if(res.type === 'clear-message'){
					this.message = [];
				} else if((res.type === 'success' || res.type === 'danger') && res.value){
					this.message = [];
					this._message(res.type, res.value, res.linkTitle, res.listId);
				}
			}
		}));
	}

	private _message(a: any, b: any, c: any = '', d: any) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}

	private getSavedProducts(){
		this.subscriptions.add(this.US.getSaved(this.id).subscribe((res) => {
			if(res){
				this.bookmarkList = res;
			}
		}));
	}

	private getWatchlists() {
		if (this.id) {
			this.loading = true;

			this.subscriptions.add(this.US.getWatchlists(this.id).subscribe(
				(res) => {
					this.watchlists = res;
				},
				(err) => {
					if (!environment.production) {
						console.log('an error has occured', err);
					}

					this.watchlists = [];
				},
				() => {
					this.SS.results(this.watchlists, 'title', 5, 10000, 2, 0);

					if (!environment.production) {
						console.log('watchlist products', this.watchlists);
					}
				}));
		}
	}

	checkItemBookmarked(productId: number): boolean {
		let found: any = this.bookmarkList.find(obj => obj.productId === productId);
		if(found){
			return true;
		}

		return false;
	}
}

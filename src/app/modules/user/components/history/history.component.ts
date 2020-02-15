import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { ModalService, LocalStorage, HttpCancelService, UserAPIService, SortingService } from '../../../../shared/services';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'history',
	templateUrl: 'history.component.html',
	styleUrls: ['history.component.scss']
})

// CLASS
export class HistoryComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');

	// STRING
	load = require('../../../../../assets/img/blank.jpg');

	// BOOLEAN
	loading = false;

	// OBJECT
	history: [];

	// ARRAY
	nitems = Array(10).fill(1);

	constructor(
		public MS: ModalService,
		private US: UserAPIService,
		private LS: LocalStorage,
		private meta: Meta,
		public SS: SortingService,
		private title: Title,
		private httpCancelService: HttpCancelService) {

		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My History - grceri');
	}

	ngOnInit() {
		this.getLists();
	}

	ngOnDestroy() {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private getLists() {
		if (this.id) {
			this.loading = true;

			this.US.getViewedProducts(this.id).subscribe((res: any) => {
				if (!environment.production) {
					console.log('history products', res);
				}

				this.history = res;

				this.SS.results(this.history, 'title', 5, 10000, 2, 2);
			},
			(err) => {
				if (!environment.production) {
					console.log('an error has occured', err);
				}

				this.loading = false;
				this.history = [];
			},
			() => {
				this.loading = false;

				if (!environment.production) {
					console.log('discovered lists', this.history);
				}
			});
		}
	}

	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

import { Component, OnInit, OnDestroy } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// SERVICES
import { UserAPIService, HttpCancelService, LocalStorage, SortingService } from '../../../../shared/services';

// ENV
import { environment } from '../../../../../environments/environment';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'favorites',
	templateUrl: 'favorites.component.html',
	styleUrls: ['favorites.component.scss']
})

// CLASS
export class FavoritesComponent implements OnInit, OnDestroy {
	// NUMBER
	id: number = this.LS.get('userId');

	// ARRAY
	nitems = Array(10).fill(1);

	// OBJECT
	favorites = [];

	// BOOLEAN
	loading = false;

	constructor(
		private US: UserAPIService,
		private LS: LocalStorage,
		public SS: SortingService,
		private meta: Meta,
		private title: Title,
		private httpCancelService: HttpCancelService) {

		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('My Favorites - grceri');
	}

	ngOnInit() {
		this.getFavorites();
	}

	ngOnDestroy() {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private getFavorites() {
		if (this.id) {
			this.loading = true;

			this.US.getSaved(this.id).subscribe((res) => {
				if (!environment.production) {
					console.log('favorite products', res);
				}

				this.favorites = res;

				this.SS.results(this.favorites, 'title', 4, 10000, 2, 1);
			},
			(err) => {
				if (!environment.production) {
					console.log('an error has occured', err);
				}

				this.loading = false;
				this.favorites = [];
			},
			() => {
				this.loading = false;

				if (!environment.production) {
					console.log('discovered lists', this.favorites);
				}
			});
		}
	}
}

import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// HHTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api`;

@Injectable()
export class CategoryAPIService implements OnDestroy {
	// CATEGORIES
	apiCategoriesInformation: any;

	// SUBJECT
	categories$ = new Subject<any[]>();

	// SUBSCRIPTION
	categoriesSubscription: Subscription;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private http: HttpClient
	) {
		this.fetchCategoriesInformation();
	}

	ngOnDestroy() {
		this.categoriesSubscription.unsubscribe();
	}

	processCategoriesAPI() {
		let url = 'misc/assets/categories';

		return this.http.get(`${api}/${url}`)
			.map(res => res)
			.do(
				(data: any) => {
					this.categories$.next(data);
				})
			.catch(this.handleError);
	}

	fetchCategoriesInformation() {
		this.categoriesSubscription = this.categories$.subscribe((res: any) => {
			this.apiCategoriesInformation = res;
		})
	}

	getCat() {
		return this.apiCategoriesInformation ?
			of(this.apiCategoriesInformation) : this.categories$;
	}

	formatted(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-');
		}
	}

	private handleError(err: HttpErrorResponse) {
		let errorMessage = '';
		if (err.error instanceof Error) {
			errorMessage = `An error occurred: ${err.error.message}`;
		} else {
			errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
		}
		// console.error(errorMessage);
		return of(null);
	}
}

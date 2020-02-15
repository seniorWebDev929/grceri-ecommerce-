import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class UserAPIService {
	constructor(private http: HttpClient) { }

	// GETS
	getEmail(val: string) {
		return this.http.get(api + 'users/email/' + val).map((res: any) => res).catch(this._errorHandler);
	}

	getWatchlists(uid: number) {
		return this.http.get(`${api}users/${uid}/watchlist`).map((res: any) => res).catch(this._errorHandler);
	}

	getViewedProducts(uid: number, pageSize: number = 10) {
		return this.http.get(`${api}users/${uid}/viewed/${pageSize}`).map((res: any) => res).catch(this._errorHandler);
	}

	getSaved(uid: number) {
		return this.http.get(`${api}users/${uid}/saved`).map((res: any) => res).catch(this._errorHandler);
	}

	getSearched(uid: number) {
		return this.http.get(`${api}users/${uid}/history/search`).map((res: any) => res).catch(this._errorHandler);
	}

	getUser(uid: number) {
		return this.http.get(`${api}users/${uid}`).map((res: any) => res).catch(this._errorHandler);
	}


	// PUT


	// POST
	postSearched(uid: number, obj: any = {}) {
		return this.http.post(`${api}users/${uid}/history/search`, obj).map((res: any) => res).catch(this._errorHandler);
	}

	postProductStatusViewed(obj: any = {}) {
		return this.http.post(`${api}users/postProductStatusViewed`, obj).map((res: any) => res).catch(this._errorHandler);
	}

	postProduct(obj: any = {}) {
		return this.http.post(`${api}users/postProduct`, obj).map((res: any) => res).catch(this._errorHandler);
	}

	postWatchlist(obj: any = {}) {
		return this.http.post(`${api}users/postWatchlist`, obj).map((res: any) => res).catch(this._errorHandler);
	}

	// postShoppinglist(uid: number, name: string, obj?: {}) {
	// 	return this.http.post(`${api}users/${uid}/shoppingList/${name}`, obj).map((res: any) => res).catch(this._errorHandler);
	// }

	// DELETE
	deleteAllRecentlySearched(uid) {
		return this.http.delete(`${api}users/${uid}/history/search`).map((res: any) => res).catch(this._errorHandler);
	}

	deleteRecentlyViewedProduct(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/viewed/${obj.productID}`).map((res: any) => res).catch(this._errorHandler);
	}

	deleteProduct(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/deleteProduct/${obj.productID}`).map((res: any) => res).catch(this._errorHandler);
	}

	removeFromWatchList(obj: any = {}) {
		return this.http.delete(`${api}users/${obj.uid}/removeFromWatchList/${obj.productID}`).map((res: any) => res).catch(this._errorHandler);
	}

	private _errorHandler(error: Response) {
		if (!environment.production) {
			console.error(error);
		}
		return Observable.throw(error || 'Server Error');
	}
}

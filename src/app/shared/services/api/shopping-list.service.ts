import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// RXJS
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs/observable/of';

// HTTP
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// SERVICES
import { ModalService } from '../modal/modal.service';

// ENVIRONMENT
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class ShoppingListAPIService {

	shoppingList: any[];
	selectedShoppingList: any = 0;

	constructor(private http: HttpClient, private MS: ModalService) {
	}

	postShoppinglist(uid: number, name: string, obj?: {}) {
		return this.http.post(`${api}users/${uid}/lists/${name}`, obj).map((res: any) => res);
	}

	updateShoppinglist(uid: number, listId: any, productId: number, obj?: {}) {
		return this.http.post(`${api}users/${uid}/lists/${listId}/${productId}`, obj).map((res: any) => res);
	}

	updateShoppinglistItems(uid: number, listId: any, obj?: {}) {
		return this.http.put(`${api}users/${uid}/lists/${listId}`, obj).map((res: any) => res).catch(this.handleError);
	}

	deleteShoppinglistItem(uid: any, listId: any, productID: any, obj?: {}) {
		return this.http.delete(`${api}users/${uid}/lists/${listId}/delete/${productID}`).map((res: any) => res).catch(this.handleError);
	}

	deleteShoppinglist(uid: any, listId: any, obj?: {}) {
		return this.http.delete(`${api}users/${uid}/lists/${listId}`).map((res: any) => res).catch(this.handleError);
	}

	userShoppingList(uid: number) {
		return this.http.get(`${api}users/${uid}/lists`).map((res: any) => res).catch(this.handleError);
	}

	getDiscoverLists() {
		return this.http.get(`${api}users/lists/discover`).map((res: any) => res).catch(this.handleError);
	}

	getFollowedLists(uid: number) {
		return this.http.get(`${api}users/${uid}/lists/following`).map((res: any) => res).catch(this.handleError);
	}

	getList(uid: number, lid: number) {
		return this.http.get(`${api}users/${uid}/lists/${lid}`).map((res: any) => res).catch(this.handleError);
	}

	getLists(uid: number) {
		return this.http.get(`${api}users/${uid}/lists`).map((res: any) => res).catch(this.handleError);
	}

	private handleError(err: HttpErrorResponse) {
		let errorMessage = '';
		if (err.error instanceof Error) {
			errorMessage = `An error occurred: ${err.error.message}`;
		} else {
			errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
		}
		console.error(errorMessage);
		return of(null);
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class SearchAPIService {
	constructor(private http: HttpClient) { }

	/**
	* API call for search page sidebar
	*/
	getSearchPageSidebar(id: number, text: string) {
		return this.http.get(`${api}search/sidebar?id=${id}&text=${text}`).map((res: any) => res).catch(this._errorHandler);
	}

	/**
	* API call for search page content
	*/
	getSearchPageContent(id: number, filter: string = '', order: string = '', text: string, page: number = 1) {
		return this.http.get(`${api}search/content?id=${id}&filter=${filter}&order=${order}&text=${text}&page=${page}`).map((res: any) => res).catch(this._errorHandler);
	}

	// SEARCH
	searchProducts(val: any) {
		return this.http.get(`${api}/search/${val}`).map((res: any) => res).catch(this._errorHandler);
	}

	private _errorHandler(error: Response) {
		if (!environment.production) {
			console.error(error);
		}
		return Observable.throw(error || 'Server Error');
	}
}

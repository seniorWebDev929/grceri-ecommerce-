import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs';

// ENV
import { environment } from '../../../../environments/environment';

// ROUTES
const api = `${environment.host}/api/`;

@Injectable()
export class ProductAPIService {
	constructor(private http: HttpClient) { }

	// PRODUCTS
	getProducts(id: string, cat: number, filter: string = '', order: string = '', pag: number) {
		return this.http.get(`${api}products?id=${id}&cat=${cat}&filter=${filter}&order=${order}&pag=${pag}`).map((res: any) => res).catch(this._errorHandler);
	}

	/**
  * Search products by category/UPC type
  */
	searchProducts(category: any, type: string, search: any) {
		return new Promise((resolve, reject) => {
			let request_url: string;

			request_url = (type !== '') ?
				`${api}products/search?type=${type}&search=${search}` :
				`${api}products/search?category=${category}&search=${search}`;

			this.http.get(request_url).subscribe(
				(res) => {
					resolve(res);
				},
				(err) => {
					reject(err);
				}
			);
		});
	}

	/**
	* Sidebar filter API request
	*/
	getSidebarFilters(id: string, cat: number) {
		return this.http.get(`${api}products/sidebarFilters?id=${id}&cat=${cat}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProduct(upc: number) {
		return this.http.get(`${api}products/${upc}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProductDetails(productId: number) {
		return this.http.get(`${api}products/product/details/${productId}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProductImages(productId: number) {
		return this.http.get(`${api}products/product/images/${productId}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProductNutrition(productId: number) {
		return this.http.get(`${api}products/product/nutrition/${productId}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProductVendors(productId: number) {
		return this.http.get(`${api}products/product/vendors/${productId}`).map((res: any) => res).catch(this._errorHandler);
	}

	getProductOverview(productId: number) {
		return this.http.get(`${api}products/product/overview/${productId}`).map((res: any) => res).catch(this._errorHandler);
	}

	postTransaction(obj: any) {
		return this.http.post(`${api}products/product/postTransactions`, obj).map((res: any) => res).catch(this._errorHandler);
	}

	getPricingPlans() {
		return this.http.get(`${api}products/product/get_pricing_plans`).map((res: any) => res).catch(this._errorHandler);
	}

	// USER
	// getUser(uid: number) {
	// 	return this.http.get(`https://grceri-api-prod.azurewebsites.net/api/users/${uid}/`).map((res: any) => res).catch(this._errorHandler);
	// }

	private _errorHandler(error: Response) {
		if (!environment.production) {
			console.error(error);
		}
		return Observable.throw(error || 'Server Error');
	}
}

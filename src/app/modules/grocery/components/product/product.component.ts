import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, OnDestroy,
				ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ROUTER
import { ActivatedRoute, Router } from '@angular/router';

// INTERFACES
import { IProductDetails, IProductImages, IProductOverview, IProductSocial, IProductVendors } from '../../../../shared/interfaces';

// SERVICES
import { LocalStorage, HttpCancelService, SessionStorage, SeoService, UserAPIService, AuthService, GoogleAnalyticsService } from '../../../../shared/services';

// RXJS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'product',
	templateUrl: 'product.component.html',
	styleUrls: ['product.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
	public product: IProductDetails;
	public Cproduct: IProductImages;
	public Oproduct: IProductOverview;
	public Sproduct: IProductSocial;
	public Vproduct: IProductVendors;

	// REVIEW
	@ViewChild('review', {static: false}) Review: ElementRef;

	// QTY
	public qty: Array<number> = [2, 3, 4, 5, 6, 7];
	public qtyDefault: Array<number> = [1];

	// DIALOG
	addedO: boolean;
	feedbackO: boolean;
	watchedO: boolean;
	feedbackSO = [];

	// SLIDERS
	items: any;

	// PRODUCT
	currentProductId: number;

	// DIET
	dietMinus: boolean;
	dietPlus: boolean;

	// SUBSCRIPTIONS
	routerSubscription: Subscription;
	productCompareSubscription: Subscription;

	constructor(
		private GS: GoogleAnalyticsService,
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
		private AS: AuthService,
		private LS: LocalStorage,
		private SSS: SessionStorage,
		private SS: SeoService,
		private US: UserAPIService,
		private changeDetector: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platform: any,
		private httpCancelService: HttpCancelService
	) {
		// this.products();

		this.addedO = false;
		this.feedbackO = false;
		this.watchedO = false;

		this.Sproduct = {};
		// this.Cproduct = {};
		this.Oproduct = {};

		// this.productCompareSubscription = this.LS.get('compare').subscribe((r) => {
		// 	if (r) {
		// 		this.comparedO = r;
		// 	} else {
		// 		this.comparedO = [];
		// 	}
		// });
	}

	ngAfterViewInit(){
		this.changeDetector.detach();
	}

	ngOnDestroy() {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
		if (this.productCompareSubscription) {
			this.productCompareSubscription.unsubscribe();
		}

		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	ngOnInit() {
		this.processRouterSubscription();
	}


	/**
	* Get carousel images as Output from Images API request
	*/
	getCarouselComponent(data) {
		this.Cproduct = {}
		this.Cproduct['images'] = data;
		this.Sproduct['images'] = data;

		if (this.product) {
			this.product['images'] = this.Cproduct.images;
			this.saveViewedProductToSessionStorage();
			this._setMetaTag();
		}

		this.changeDetector.detectChanges();
	}

	/**
	* Get Overview component data as Output after API request
	*/
	// getOverviewComponent(data) {
	// 	if (this.product && this.Cproduct.images) {
	// 		this.setMetaTag();
	// 	}
	// }

	/**
	* Get details component data as Output after API request
	*/
	getProductDetailsComponent(data) {
		this.product = data;

		this.Sproduct['title'] = this.product.title;
		this.Sproduct['category'] = this.product.category;
		this.Sproduct['brand'] = this.product.brand;

		if (this.Cproduct && this.Cproduct.images) {
			this.product['images'] = this.Cproduct.images;
			this.saveViewedProductToSessionStorage();
			this._setMetaTag();
			this._gEvent();
		}

		this.changeDetector.detectChanges();
	}

	saveViewedProductToSessionStorage() {
		if (!this.AS.isAuthenticated()) {
			// let currentProduct = this.product;
			// let storedProductInformation = {
			// 	Title: currentProduct.title,
			// 	productId: currentProduct.productId,
			// 	image: currentProduct.images[0].thumbnail,
			// 	Price: currentProduct.vendorPrice,
			// 	vendorsPrice: currentProduct.vendorsPrice,
			// 	savings: currentProduct.savings,
			// 	vendor: currentProduct.vendor
			// };

			let viewedProducts = this.LS.get('viewed_products');
			if (!environment.production) {
				console.log('viewedProducts', viewedProducts);
			}

			if (viewedProducts != null) {
				let products: any[] = viewedProducts;
				let searchedProduct = products.find((element: any) => element.productId === this.product.productId);
				if (searchedProduct === undefined) {
					products.push(this.product);
					this.LS.set('viewed_products', products);
				}
			} else {
				let products: any[] = [];
				products.push(this.product);
				this.LS.set('viewed_products', products);
			}
		}
	}

	/**
	* Get vendors component data as Output after API request
	*/
	getProductVendorsComponent(data) {
		this.Vproduct = data;

		this.changeDetector.detectChanges();
	}

	private _gEvent() {
		// GOALS
		this.GS.event('event', `Product Viewed - ${this.product.title} (${this.product.productId})`, 'none', 0);

		// ECOMMERCE
		let productF = {
			'items': [
				{
					'id': this.product.productId,
					'name': this.product.title,
					'brand': this.product.brand,
					'category': this.product.category,
					'price': this.product.price,
				}
			]
		}

		this.GS.commerce('view_item', productF);
	}

	/**
	* Set meta tag after required subscriptions are done
	*/
	private _setMetaTag() {
		// SEO
		this.SS.generateTags({
			title: 'Buy Online ' + this.product.title + ' - grceri',
			description: 'Shop online ' + this.product.title + 'at affordable rates from grceri ' + this.Sproduct['category'] + ' Store',
			card: 'summary_large_image',
			image: this.Cproduct['images'][0]['original'],
			type: 'product',
			url: this.router.url
		});
	}

	/**
	* Process router subscription to get url parameter and process API requests
	*/
	private processRouterSubscription() {
		this.routerSubscription = this.route.params.subscribe(params => {
			this.currentProductId = params['productId'];
			this.changeProductViewedStatus();
		});
	}

	/**
	* If user is logged in save the product as viewed
	*/
	private changeProductViewedStatus() {
		if (this.AS.isAuthenticated()) {
			let userId = this.LS.get('userId');
			let productObject = {
				uid: userId,
				productID: this.currentProductId
			};

			this.US.postProductStatusViewed(productObject).subscribe((res) => {
				if (!environment.production) {
					console.log('product viewed status', res);
				}
			})
		}
	}

	/**
	* Separate product.title parameter and merge with new object
	*/
	private processProductTitleToMerge() {
		let productTitle: object = {};

		if (this.product !== undefined) {
			productTitle = {
				title: this.product.title
			};
		}

		return productTitle;
	}

	/**
	* Check objects set and merge them to one object
	*/
	private mergeObjects(obj, src) {
		if (obj === undefined) {
			return src;
		}
		if (src === undefined) {
			return obj;
		}

		Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
		return obj;
	}

	added(v): boolean {
		return this.addedO = v;
	}

	popup(i) {
		if (i === 'feedback') {
			this.feedbackO = true;
		}
	}

	feedback(a, b) {
		if (b === 'open') {
			this.feedbackO = a;
		} else {
			this.feedbackSO.push(a);
		}
	}

	feedbackS(item): boolean {
		let e = this.feedbackSO.find(r => r === item);
		if (e) {
			return true;
		} else {
			return false;
		}
	}

	watchedF(v): boolean {
		return this.addedO = v;
	}

	scrollReview() {
		this.Review.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	routeCatagoryPageRouterLink(category, subCategory, brand) {
		let categoryURL = '/groceries';

		if (category) {
			categoryURL = `${categoryURL}/${this.url(category)}`;
		}
		if (subCategory) {
			categoryURL = `${categoryURL}/${this.url(subCategory)}`;
		}

		this.router.navigate([categoryURL], { queryParams: { Brand: encodeURIComponent(JSON.stringify([brand])) }});
	}

	private url(i) {
		return i.toLowerCase().replace(/(?:( and )|(&)|(,)|(\s)|[/])+/g, '-');
	}
}

import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

// SERVICES
import { BarcodeService } from '../../../services';

// ROUTER
import { Router } from '@angular/router';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	selector: 'mobile-barcode',
	templateUrl: './barcode.component.html'
})
export class MobileBarcodeComponent implements AfterViewInit, OnDestroy {
	@ViewChild('barcode', {static: false}) barecodePopupElem: any;

	private routerChangeSubscription: Subscription;

	constructor(
		public BS: BarcodeService,
		public router: Router) {
		this.checkRouterChanges();
	}

	ngAfterViewInit() {
		this.BS.barcodePopup = this.barecodePopupElem;
	}

	ngOnDestroy() {
		if (this.routerChangeSubscription) {
			this.routerChangeSubscription.unsubscribe();
		}
	}

	checkRouterChanges() {
		this.routerChangeSubscription = this.router.events.subscribe((val) => {
			this.BS.closeScanner();
		});
	}
}

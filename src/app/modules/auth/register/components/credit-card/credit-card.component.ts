import {
	Component, OnInit, OnDestroy,
	ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter
} from '@angular/core';

import { Router } from '@angular/router';

import {
	FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors
} from '@angular/forms';

import {
	StripeService, Elements, Element as StripeElement, ElementsOptions,
	StripeInstance
} from 'ngx-stripe';

// SERVICES
import { GoogleAnalyticsService } from '../../../../../shared/services';

// ENV
import { environment } from '../../../../../../environments/environment';

@Component({
	selector: 'credit-card',
	templateUrl: 'credit-card.component.html',
	styleUrls: ['credit-card.component.scss']
})

export class CreditCardComponent implements OnInit, OnDestroy {
	// SIGN UP
	@Input('email') email: string;
	@Input('password') password: string;
	@Output() creditCardValidate = new EventEmitter<any>();

	// STRIPE
	@ViewChild('form', {static: false}) Form: ElementRef
	@ViewChild('cardInfo', {static: false}) cardInfo: ElementRef
	@ViewChild('cardNumberElement', {static: false}) cardNumberElement: ElementRef
	@ViewChild('cardExpiryElement', {static: false}) cardExpiryElement: ElementRef
	@ViewChild('cardCVCElement', {static: false}) cardCVCElement: ElementRef

	billing: FormGroup;

	express: any;
	paymentRequest: any;
	cardHandler = this.onChange.bind(this);
	error: string;
	amount: string;
	name: string;

	// STRIPE
	elements: Elements;
	card: StripeElement;
	cardNumber: StripeElement;
	cardExpiry: StripeElement;
	cardCvc: StripeElement;

	// STRIPE - optional parameters
	elementsOptions: ElementsOptions = {
		locale: 'es'
	};

	stripe: StripeInstance;

	constructor(
		private GS: GoogleAnalyticsService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private router: Router,
		private stripeService: StripeService) {
	}

	ngOnInit() {

		this.billing = this.fb.group({
			cardNumberHidden: [false, Validators.requiredTrue],
			cardExpiryHidden: [false, Validators.requiredTrue],
			cardCVCHidden: [false, Validators.requiredTrue],
			name: ['', Validators.required],
			zip: ['', Validators.required],
		});

		this.billing.setValidators(this._validateCardInformation());

		this.stripeService.elements(this.elementsOptions)
			.subscribe(elements => {
				this.elements = elements;

				this.mountCardFormFieldsSeparately();

			});
	}

	private mountCardFormFieldsSeparately() {
		let style = {
			base: {
				fontFamily: '"AB", sans-serif',
				fontWeight: '600',
				'::placeholder': {
					color: '#999',
				}
			},
			invalid: {
				iconColor: 'red',
				color: 'red',
			}
		};

		if (!this.cardNumber) {
			this.cardNumber = this.elements.create('cardNumber', { style });
			this.cardNumber.mount(this.cardNumberElement.nativeElement);
		}

		if (!this.cardExpiry) {
			this.cardExpiry = this.elements.create('cardExpiry', { style });
			this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
		}

		if (!this.cardCvc) {
			this.cardCvc = this.elements.create('cardCvc', { style });
			this.cardCvc.mount(this.cardCVCElement.nativeElement);
		}

		// this.expressbtn();
	}

	private updatedCardInformation() {
		if(!this.cardNumber || !this.cardExpiry || !this.cardCvc)
			return false;

		let cardNumberControl = this.billing.controls['cardNumberHidden'];
		let cardExpiryControl = this.billing.controls['cardExpiryHidden'];
		let cardCVCControl = this.billing.controls['cardCVCHidden'];

		this.cardNumber.on('change', (event) => {
			let isValid = event.complete;
			cardNumberControl.setValue(isValid);
		});

		this.cardExpiry.on('change', (event) => {
			let isValid = event.complete;
			cardExpiryControl.setValue(isValid);
		});

		this.cardCvc.on('change', (event) => {
			let isValid = event.complete;
			cardCVCControl.setValue(isValid);
		});
	}

	private _validateCardInformation(): ValidatorFn {
		return (group: FormGroup): ValidationErrors => {
			const nameControl = group.controls['name'];
			const zipControl = group.controls['zip'];

			this.updatedCardInformation();

			let cardNumberControl = group.controls['cardNumberHidden'];
			let cardExpiryControl = group.controls['cardExpiryHidden'];
			let cardCVCControl = group.controls['cardCVCHidden'];

			if (nameControl.valid && zipControl.valid &&
				cardNumberControl.valid && cardExpiryControl.valid && cardCVCControl.valid) {
				this.creditCardValidate.emit(true);
			} else {
				this.creditCardValidate.emit(false);
			}

			return null;
		};
	}

	public async createCardToken() {
		const name = this.billing.get('name').value;

		let token = await this.stripeService.createToken(this.cardNumber, name).toPromise();

		return token;
	}

	async mountButton() {
		const result = await this.paymentRequest.canMakePayment();

		if (result) {
			this.express.mount('#express');
		} else {
			if (!environment.production) {
				console.error('https support only for express payment');
			}
		}

	}

	ngOnDestroy() {
	}

	onChange({ error }) {
		if (error) {
			this.error = error.message;
		} else {
			this.error = null;
		}
		this.cd.detectChanges();
	}
}

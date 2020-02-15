import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer, AfterViewInit } from '@angular/core';

// ROUTER
import { Router } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// SERVICES
import { AuthService, HttpCancelService, UserAPIService, InstallPWAService } from '../../../shared/services';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap';

// ENV
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
	// FORMGROUP
	login: FormGroup;

	// BOOLEAN
	first = true;
	icon = false;
	show = false;

	// ARRAY
	message: Array<object> = [];
	items: Array<object> = [];

	// ELEMENT REF
	@ViewChild('email', {static: false}) email: ElementRef;
	@ViewChild('pass', {static: false}) pass: ElementRef;

	constructor(
		public IS: InstallPWAService,
		private router: Router,
		private US: UserAPIService,
		private meta: Meta,
		private title: Title,
		private AS: AuthService,
		private fb: FormBuilder,
		private httpCancelService: HttpCancelService) {
	}

	ngOnInit() {
		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
		this.title.setTitle('Log In - grceri');

		this._form();
	}

	ngAfterViewInit() {
		this._autoLogin();
	}

	ngOnDestroy(): void {
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private _form() {
		return this.login = this.fb.group({
			email: ['',  Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			remember: ['']
		});
	}

	submit(email, password, remember?) {
		if (navigator.credentials) {
			// CREATE STORE
			let passwordcred = new PasswordCredential({
				'type': 'password',
				'id': email,
				'password': password
			});

			// PASS TO BROWSER
			navigator.credentials.store(passwordcred);
		}

		this.icon = true;

		this.AS.login(email, password, remember).subscribe(
			(res) => {
				if (res['status'] !== 200) {
					this._message('danger', res['error_description']);
				}
			},
			(err) => {
				this._message('danger', err['error_description']);
			},

			() => {
				this.icon = false;
			}
		);
	}

	checkEmail() {
		let email = this.login.controls.email.value;

		if (this.validateEmail(email)) {
			// LOADING
			this.icon = true;

			// CHECK EMAIL
			this.US.getEmail(email).subscribe((res) => {
				// LOADING
				this.icon = false;

				// IF EXISTS
				if (res['user']) {
					// GO TO SECOND PAGE
					this.first = false;
				} else {
					// SEND MESSAGE ERROR
					this._message('danger', `This email address doesn't exist.`);

					// SET INPUT TO FALSE
					this.login.controls.email.setErrors({'incorrect': true});
				};
			})
		};
	}

	validateEmail(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	private _autoLogin() {
		if (navigator.credentials) {
			navigator.credentials.get({ 'password': true })
			.then((credential) => {
				if (!credential) {
					throw new Error('No credential found');
				} else {
					console.log(credential);

					this.login.controls.email.setValue(credential.id);
					this.login.controls['email'].markAsTouched();

					this.checkEmail();

					// SET PASSWORD VALUE
					this.login.controls.password.setValue(credential['password']);
					this.login.controls['password'].markAsTouched();

					// this.submit(credential['id'], credential['password']);
				}
			});
		}
	}

	private _message(a, b) {
		this.message.push({
			type: a,
			value: b
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}
}

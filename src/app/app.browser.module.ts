import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// COMPONENT
import { AppComponent } from './app.component';

// ROUTING
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'

// LOADING BAR
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// LOADING
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

// SHARED
import {
	HeaderModule,
	FooterModule,
	MobileSearchModule,
	MobileVoiceModule,
	MobileBarcodeModule,
	ListsCreateModule,
	ListsSelectModule,
	// MessagePopupModule,
	ConfirmationPopupModule
} from './shared/components';

// PROVIDERS
import {
	AuthGuardService,
	LoggedInService,
	AuthService,
	SearchAPIService,
	SearchBarService,
	VoiceService,
	LocalStorage,
	SessionStorage,
	UserAPIService,
	ProductAPIService,
	SeoService,
	LinkTagService,
	GoogleAnalyticsService,
	BarcodeService,
	InstallPWAService,
	SortingService,
	ShoppingListAPIService,
	ModalService,
	HttpCancelService,
	DeviceService,
	ExcelService
} from './shared/services';
import { ItemComponent } from './shared/components/item/item.component';

// PWA
import { ServiceWorkerModule } from '@angular/service-worker';

// ENV
import { environment } from '../environments/environment';

// STRIPE
import { NgxStripeModule } from 'ngx-stripe';
import { HttpModule } from '@angular/http';

// ROUTER
import { AppRoutingModule } from './app-routing.module';

// INTERCEPTORS
import { HttpCancelInterceptor } from './shared/interceptors/http/http.interceptor';

// BOOTSTRAP
import { BsModalService, ModalModule } from 'ngx-bootstrap';

// DEVICE
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'app-root' }),
		environment.production ? ServiceWorkerModule.register('./ngsw-worker.js') : [],
		NgxStripeModule.forRoot('pk_live_bHAUyTYFlwDo40Qav44OqqdB'),
		ModalModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		HttpModule,

		// LAZY IMG
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),

		// SHARED
		HeaderModule,
		FooterModule,
		MobileSearchModule,
		MobileVoiceModule,
		MobileBarcodeModule,
		ListsCreateModule,
		ListsSelectModule,
		// MessagePopupModule,
		ConfirmationPopupModule,
		LoadingBarHttpClientModule,
		DeviceDetectorModule.forRoot()
	],
	providers: [
		HttpCancelService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpCancelInterceptor,
			multi: true
		},
		AuthGuardService,
		LoggedInService,
		AuthService,
		LocalStorage,
		SessionStorage,
		UserAPIService,
		SearchAPIService,
		VoiceService,
		SearchBarService,
		ProductAPIService,
		BarcodeService,
		SeoService,
		LinkTagService,
		GoogleAnalyticsService,
		InstallPWAService,
		SortingService,
		ShoppingListAPIService,
		BsModalService,
		ModalService,
		ItemComponent,
		HttpClient,
		DeviceService,
		ExcelService
	],
	bootstrap: [AppComponent]
})

export class AppBrowserModule { }

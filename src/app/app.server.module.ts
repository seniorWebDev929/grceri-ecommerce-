import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from './app.component';
import { AppBrowserModule } from './app.browser.module';

@NgModule({
	imports: [
		AppBrowserModule,
		ServerModule,
		ModuleMapLoaderModule,
		ServerTransferStateModule,
	],
	bootstrap: [AppComponent]
})
export class AppServerModule { }

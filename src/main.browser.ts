import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app.browser.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
	platformBrowserDynamic().bootstrapModule(AppBrowserModule).then(() => {
		if (environment.production) {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('./ngsw-worker.js');
			}
		}
	})
		.catch(err => console.log(err));
});

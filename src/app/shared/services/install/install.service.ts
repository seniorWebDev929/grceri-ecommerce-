import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// GA
import { GoogleAnalyticsService } from '../google/google-analytics.service';

@Injectable()
export class InstallPWAService {
	// ANY
	deferredPrompt;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		private GA: GoogleAnalyticsService) { }

	startPrompt() {
		if (isPlatformBrowser(this.platform)) {
			window.addEventListener('beforeinstallprompt', (e) => {
				// Prevent Chrome 67 and earlier from automatically showing the prompt
				e.preventDefault();
				// Stash the event so it can be triggered later.
				this.deferredPrompt = e;
			});
		};
	}

	clickPrompt(from: string) {
		this.deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		this.deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');

				this.GA.event('install', `${from} Prompt`, 'click', 0);
			}

			this.deferredPrompt = null;
		});
	}
}

import { Component } from '@angular/core';

// SERVICES
import { VoiceService } from '../../../services';

@Component({
	selector: 'mobile-voice',
	templateUrl: './voice.component.html',
})
export class MobileVoiceComponent {
	constructor(public VS: VoiceService) {
	}
}

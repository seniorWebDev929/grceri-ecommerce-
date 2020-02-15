import { Component, OnInit } from '@angular/core';

// SEO
import { Title } from '@angular/platform-browser';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'profile',
	templateUrl: 'profile.component.html',
})

// CLASS
export class ProfileComponent implements OnInit {
	constructor(title: Title) {
		title.setTitle('Profile - grceri');
	}

	ngOnInit() {
		// If no default value in Status input, set filter to empty array
	}
}

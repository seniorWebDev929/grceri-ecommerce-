import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'lists-tile',
	templateUrl: 'tile.component.html',
	styleUrls: ['tile.component.scss']
})

// CLASS
export class ListsTileComponent {
	// INPUT
	@Input() data: any;

	// STRING
	load = require('../../../../../../assets/img/blank.jpg');

	constructor() {}
}

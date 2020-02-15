import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

// SERVICES
import { ModalService } from '../../../services';

@Component({
	moduleId: module.id,
	selector: 'message-popup',
	templateUrl: 'message.component.html'
})

// CLASS
export class MessagePopupComponent implements OnInit, AfterViewInit {
	@ViewChild('message', {static: false}) message: any;

	text: string;

	constructor(
		public MS: ModalService
	) {
	}

	ngOnInit(): void {
		this.MS.data$.next(undefined);
		this.getPopupMessage();
	}

	ngAfterViewInit() {
		this.MS.messageModal = this.message;
	}

	private getPopupMessage() {
		this.MS.fetchModalData().subscribe(res => {
			if (res) {
				this.text = res.value;
			}
		}, error => error);
	}

}

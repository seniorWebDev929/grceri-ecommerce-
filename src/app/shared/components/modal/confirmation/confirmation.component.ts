import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

// SERVICES
import { ModalService } from '../../../services';

import { environment } from '../../../../../environments/environment';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'confirmation-popup',
	templateUrl: 'confirmation.component.html',
	styleUrls: ['confirmation.component.scss']
})

// CLASS
export class ConfirmationPopupComponent implements OnInit, AfterViewInit {
	@ViewChild('confirmation', {static: false}) confirmation: any;

	text: string;
	type: string;

	constructor(
		public MS: ModalService
	) {
	}

	ngOnInit(): void {
		this.MS.data$.next(undefined);
		this.getPopupMessage();
	}

	ngAfterViewInit(): void {
		this.MS.confirmationModal = this.confirmation;
	}

	private getPopupMessage(): void {
		this.MS.fetchModalData().subscribe(res => {
			if (res) {
				this.type = res.type;
				this.text = res.value;
			}
		}, error => error);
	}

	confirmAction(): void {
		if (this.type === 'deleteall') {
			let message: any = this.MS.processModalAlertInformation('success-deleteall', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'selectall') {
			let message: any = this.MS.processModalAlertInformation('success-selectall', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'uncheckall') {
			let message: any = this.MS.processModalAlertInformation('success-uncheckall', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'deletecompleted') {
			let message: any = this.MS.processModalAlertInformation('success-deletecompleted', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'movecopy') {
			let message: any = this.MS.processModalAlertInformation('success-movecopy', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'deletelist') {
			let message: any = this.MS.processModalAlertInformation('success-deletelist', 'confirmed');
			this.MS.data$.next(message);
		} else if (this.type === 'exportlist') {
			let message: any = this.MS.processModalAlertInformation('success-exportlist', 'confirmed');
			this.MS.data$.next(message);
		}

		this.MS.close();
	}

	cancelAction(): void {
		this.MS.close();
	}

}

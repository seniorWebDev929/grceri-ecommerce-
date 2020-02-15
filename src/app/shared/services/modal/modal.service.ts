import { Injectable, TemplateRef, OnDestroy } from '@angular/core';

// BOOTSTRAP
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class ModalService implements OnDestroy {
	modalRef: BsModalRef;

	createListsModal: TemplateRef<any>;
	selectListsModal: TemplateRef<any>;
	watchListsPopupModal: TemplateRef<any>;
	messageModal: TemplateRef<any>;
	confirmationModal: TemplateRef<any>;

	// DATA
	data$: BehaviorSubject<any> = new BehaviorSubject(null);
	watchList$: BehaviorSubject<any> = new BehaviorSubject(null);

	// OBJECT
	obj: any = {};

	// SUBSCRIPTIONS
	modalCloseSubscription: Subscription;

	constructor(
		private modalService: BsModalService
	) { }

	ngOnDestroy() {
		if (this.modalCloseSubscription) {
			this.modalCloseSubscription.unsubscribe();
		}
	}

	private showModal(template: TemplateRef<any>, config) {
		this.modalRef = this.modalService.show(template, config);

		this.modalCloseSubscription = this.modalService.onHidden.subscribe((reason: string) => {
			if (reason === 'backdrop-click') {
				this.resetInitialState();
			}
		});
	}

	fetchModalData() {
		return this.data$;
	}

	openCreateListsModal(config) {
		if (this.createListsModal) {
			this.showModal(this.createListsModal, config);
		}
	}

	openSelectListsModal(config) {
		if (this.selectListsModal) {
			this.showModal(this.selectListsModal, config);
		}
	}

	openWatchListsModal(config) {
		if (this.watchListsPopupModal) {
			this.showModal(this.watchListsPopupModal, config);
		}
	}

	openMessageModal(config) {
		if (this.messageModal) {
			this.showModal(this.messageModal, config);
		}
	}

	openConfirmationModal(config) {
		if (this.confirmationModal) {
			this.showModal(this.confirmationModal, config);
		}
	}

	close() {
		if (this.modalRef) {
			this.resetInitialState();
			this.modalRef.hide();
		}
	}

	private resetInitialState() {
		let message: any = this.processModalAlertInformation('success', '');
		this.data$.next(message);
	}

	processModalAlertInformation(type: string, value: string, linkTitle: any = '', listId: number = 0) {
		let message: any = {
			type,
			value,
			linkTitle,
			listId
		}

		return message;
	}

}

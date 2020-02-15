import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { ModalService, ShoppingListAPIService, LocalStorage } from '../../../services';

// FORMS
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

// RXJS
import { Subscription } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'lists-select',
	templateUrl: 'lists-select.component.html'
})

// CLASS
export class ListsSelectComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('select', {static: false}) select: any;

	// NUMBER
	id: number = this.LS.get('userId');

	// FORMGROUP
	form: FormGroup;

	// SUBSCRIPTIONS
	shoppingListSubscription: Subscription;

	updating = false;
	type: any;
	text: any;

	constructor(
		private LS: LocalStorage,
		public SLS: ShoppingListAPIService,
		public MS: ModalService,
		private fb: FormBuilder,
		private changeDetector: ChangeDetectorRef
	) {
		this._form();
	}

	ngAfterViewInit() {
		this.MS.selectListsModal = this.select;
	}

	ngOnInit(): void {
		this.fetchRequestType();
	}

	ngOnDestroy() {
		if (this.shoppingListSubscription) {
			this.shoppingListSubscription.unsubscribe();
		}
	}

	fetchRequestType(): void {
		this.MS.fetchModalData().subscribe(res => {
			if (res) {
        this.type = res.type;
        this.text = res.value;
			}
		}, error => error);
	}

	private _form() {
		return this.form = this.fb.group({
			select: [this.SLS.selectedShoppingList, this._validateSelection]
		});
	}

	private _validateSelection(selectedList: AbstractControl) {
		let value = selectedList.value;

		return (Number(value) === 0) ? { selected: false } : null;
	}

	submit() {
		if (this.id) {
			if(this.type === 'process-movecopy' && this.text === 'confirmed'){
				this.updateListMultipleItems();
			} else {
				this.updateListSingleItem();
			}

			this.MS.close();
		}
	}

	private updateListMultipleItems(): void {
		let message: any = this.MS.processModalAlertInformation('success-process-movecopy', 'confirmed');
		this.MS.data$.next(message);
	}

	private updateListSingleItem(): void {
		this.updating = true;
		let listId: number = this.form.controls['select'].value;
		this.form.controls['select'].setValue(0);

		let productId: number = Number(this.MS.obj.productId);
		this.changeDetector.detectChanges();

		this.SLS.updateShoppinglist(this.id, listId, productId).subscribe((res) => {
			this.updating = false;
			this.MS.data$.next(undefined);
			if (res) {
				let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully added. ', 'View list', listId);
				this.MS.data$.next(message);
				if (!environment.production) {
					console.log('Shopping List Updated')
				}
			}
			this.changeDetector.detectChanges();
		}, (error) => {
			this.updating = false;
			let message: any;
			if (error.status === 400) {
				message = this.MS.processModalAlertInformation('danger', 'Product already added to the list');
			} else {
				message = this.MS.processModalAlertInformation('danger', 'Error when adding product');
			}
			this.MS.data$.next(message);
			if (!environment.production) {
				console.log('Shopping List Error')
			}
			this.changeDetector.detectChanges();
		});
	}
}

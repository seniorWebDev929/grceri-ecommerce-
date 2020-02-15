import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

// SERVICES
import { ModalService, ShoppingListAPIService, LocalStorage } from '../../../services';

// FORMS
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
	moduleId: module.id,
	selector: 'lists-create',
	templateUrl: 'create.component.html',
	styleUrls: ['create.component.scss']
})

// CLASS
export class ListsCreateComponent implements AfterViewInit {
	@ViewChild('create', {static: false}) create: any;

	// NUMBER
	id: number = this.LS.get('userId');

	// FORMGROUP
	form: FormGroup;

	// BOOLEAN
	saving = false;

	constructor(
		private LS: LocalStorage,
		private SLS: ShoppingListAPIService,
		public MS: ModalService,
		private fb: FormBuilder,
		private changeDetector: ChangeDetectorRef
	) {
		this._form();
	}

	ngAfterViewInit() {
		this.MS.createListsModal = this.create;
	}

	private _form() {
		return this.form = this.fb.group({
			input: ['', [Validators.compose([Validators.required, Validators.minLength(1)]), Validators.pattern('^[a-zA-Z0-9 \-\']+')]],
			visible: ['Public', Validators.required]
		});
	}

	submit(form) {
		if (this.id) {
			this.saving = true;

			let name: any = form.controls['input'].value;
			let visible: string = form.controls['visible'].value;

			let productId: any = this.MS.obj.productId;
			let shoppingListObject: object = {
				list: [productId],
				visible
			};

			this.MS.data$.next(undefined);
			this.changeDetector.detectChanges();
			this.SLS.postShoppinglist(this.id, name, shoppingListObject).subscribe((res) => {
				this.saving = false;
				this.MS.data$.next(undefined);
				if (res.success) {
					let message: any = this.MS.processModalAlertInformation('success', 'List has been successfully created.');
					this.MS.data$.next(message);
					if (!environment.production) {
						console.log('Shopping List Posted')
					}
				}
				this.changeDetector.detectChanges();
			}, (error) => {
				this.saving = false;
				let message: any;
				if (error.status === 400) {
					message = this.MS.processModalAlertInformation('danger', 'Product already added to the list');
				} else {
					message = this.MS.processModalAlertInformation('danger', 'There was error creating new list.');
				}
				this.MS.data$.next(message);
				if (!environment.production) {
					console.log('Shopping List Error')
				}
				this.changeDetector.detectChanges();
			});

			this.MS.close();
		}
	}
}

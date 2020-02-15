import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

// ROUTER
import { Router, ActivatedRoute } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// FORMGROUP
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// SERVICES
import {
	SearchBarService, BarcodeService, UserAPIService, ModalService,
	AuthService, DeviceService, LocalStorage, ExcelService, ShoppingListAPIService, HttpCancelService
} from '../../../../../shared/services';

// SHARE
import { NgNavigatorShareService } from 'ng-navigator-share';

// BOOTSTRAP
import { AlertComponent } from 'ngx-bootstrap';

// RXJS
import { Subscription } from 'rxjs';

// ENV
import { environment } from '../../../../../../environments/environment';

// PLATFORM
import { isPlatformBrowser } from '@angular/common';

@Component({
	moduleId: module.id,
	selector: 'lists-single',
	templateUrl: 'single.component.html',
	styleUrls: ['single.component.scss']
})

// CLASS
export class ListsSingleComponent implements OnInit, OnDestroy {
	// FORMGROUP
	editMobileListGroup: FormGroup;
	editDesktopListGroup: FormGroup;

	// BOOLEAN
	listDetails: false;
	disableAddToList = false;
	hideCompleted = false;
	loading = false;
	editMobileListInfo = false;
	editDesktopListInfo = false;

	// OBJECT
	user = [];
	single: {} = {};
	config = {
		class: 'modal-confirm',
		animated: false,
		backdrop: true
	};
	checked: any[] = [];
	backupList: any = {};
	followingLists: any[];

	// ARRAY
	nitems = Array(10).fill(1);

	// NUMBER
	id: number = this.LS.get('userId') === null || this.LS.get('userId') === undefined ? 0 : this.LS.get('userId');

	// STRING
	load = require('../../../../../../assets/img/blank.jpg');
	listId: any;
	followListTitle: boolean = true;

	// ARRAY
	message: Array<object> = [];

	// SUBSCRIPTIONS
	getListSubscription: Subscription;
	updateListSubscription: Subscription;
	getViewedProductsSubscription: Subscription;
	getSavedProductsSubscription: Subscription;
	deleteListItemSubscription: Subscription;
	deleteFollowListSubscription: Subscription;
	deleteUnfollowListSubscription: Subscription;
	modalDataSubscription: Subscription;
	routerSubscription: Subscription;
	updateShoppinglistSubscription: Subscription;
	userShoppingListSubscription: Subscription;
	deleteListSubscription: Subscription;
	updateMobileListSubscription: Subscription;
	updateDesktopListSubscription: Subscription;
	followListSubscription: Subscription;

	emailContent: string;

	constructor(
		@Inject(PLATFORM_ID) private platform: any,
		public DS: DeviceService,
		private LS: LocalStorage,
		private US: UserAPIService,
		private AS: AuthService,
		private fb: FormBuilder,
		private SLS: ShoppingListAPIService,
		private MS: ModalService,
		public BS: BarcodeService,
		public SBS: SearchBarService,
		private router: ActivatedRoute,
		private route: Router,
		public NSS: NgNavigatorShareService,
		private ES: ExcelService,
		private meta: Meta,
		private title: Title,
		private httpCancelService: HttpCancelService) {

		this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
	}

	ngOnInit() {
		this.MS.data$.next(undefined);
		this.email();
		this._mobileForm();
		this._desktopForm();
		this.fetchConfirmationMessage();
		this.getListId();
		this.getFollowingList();
		this.getList();
	}

	ngOnDestroy() {
		if (this.getListSubscription) {
			this.getListSubscription.unsubscribe();
		}
		if (this.getViewedProductsSubscription) {
			this.getViewedProductsSubscription.unsubscribe();
		}
		if (this.getSavedProductsSubscription) {
			this.getSavedProductsSubscription.unsubscribe();
		}
		if (this.updateListSubscription) {
			this.updateListSubscription.unsubscribe();
		}
		if (this.deleteListItemSubscription) {
			this.deleteListItemSubscription.unsubscribe();
		}
		if (this.deleteFollowListSubscription) {
			this.deleteFollowListSubscription.unsubscribe();
		}
		if (this.deleteUnfollowListSubscription) {
			this.deleteUnfollowListSubscription.unsubscribe();
		}
		if (this.modalDataSubscription) {
			this.modalDataSubscription.unsubscribe();
		}
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
		if (this.updateShoppinglistSubscription) {
			this.updateShoppinglistSubscription.unsubscribe();
		}
		if (this.userShoppingListSubscription) {
			this.userShoppingListSubscription.unsubscribe();
		}
		if (this.deleteListSubscription) {
			this.deleteListSubscription.unsubscribe();
		}
		if (this.updateMobileListSubscription) {
			this.updateMobileListSubscription.unsubscribe();
		}
		if (this.updateDesktopListSubscription) {
			this.updateDesktopListSubscription.unsubscribe();
		}
		if (this.followListSubscription) {
			this.followListSubscription.unsubscribe();
		}
		this.httpCancelService.cancelPendingRequests();
		if (!environment.production) {
			console.log('canceled pending request');
		}
	}

	private email() {
		if (isPlatformBrowser(this.platform)) {
			this.emailContent = 'mailto:?Subject=Look at my shopping list!&body=' + window.location.href.toString();
		}
	}

	private _mobileForm() {
		return this.editMobileListGroup = this.fb.group({
			listTitle: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
			listDescription: ['', Validators.compose([Validators.maxLength(200)])]
		});
	}

	private _desktopForm() {
		return this.editDesktopListGroup = this.fb.group({
			desktopListTitle: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
			desktopListDescription: ['', Validators.compose([Validators.maxLength(200)])]
		});
	}

	private isLoggedIn(res) {
		if (!this.AS.isAuthenticated() && res['isOwner']) {
			this.route.navigate(['/login']);
		}
	}

	private _message(a: any, b: any, c: any = '', d: any) {
		this.message.push({
			type: a,
			value: b,
			linkTitle: c,
			listId: d
		})
	}

	private _close(a: AlertComponent) {
		this.message = this.message.filter((i) => i !== a);
	}

	undoAddListItem(listId: any, productID: number): void {
		let obj: any = {
			uid: Number(this.id),
			listId,
			productID: Number(productID)
		};
		this.deleteListItemSubscription = this.SLS.deleteShoppinglistItem(this.id, listId, productID).subscribe(res => {
			let message: any = this.MS.processModalAlertInformation('success', 'Action undone.');
			this.MS.openMessageModal(this.config);
			this.MS.data$.next(message);
			this.updateList();
		});
	}

	undoAddFollowList($event: any): void {
		$event.preventDefault();
		this.message = [];
		this.MS.data$.next(undefined);
		this.deleteFollowListSubscription = this.SLS.deleteShoppinglist(this.id, this.listId).subscribe(res => {
			if (res.success) {
				let message: any = this.MS.processModalAlertInformation('success', 'Action undone.');
				this.MS.data$.next(message);
			}
		});
	}

	setAlertType(type: string): string {
		if (type === 'undo-following') {
			return 'success';
		}

		return type;
	}

	private fetchConfirmationMessage(): void {
		this.modalDataSubscription = this.MS.fetchModalData().subscribe(res => {
			if (res) {
				if (res.type === 'success-deleteall') {
					if (this.checked.length > 0) {
						let productIDS: any = { ...this.single['list'].map(obj => obj.productId) };
						this.SLS.updateShoppinglistItems(this.id, this.listId, productIDS).subscribe((res) => {
							let message: any = this.MS.processModalAlertInformation('success', 'Products have been deleted successfully. ');
							this.MS.data$.next(message);
							this.checked = [];
						});
					}

				} else if (res.type === 'success-selectall') {
					Array.prototype.push.apply(this.checked, this.single['list']);
					this.single['list'] = [];
				} else if (res.type === 'success-uncheckall') {
					if (this.checked.length > 0) {
						Array.prototype.push.apply(this.single['list'], this.checked);
						this.checked = [];
					}
				} else if (res.type === 'success-deletecompleted') {
					if (this.checked.length > 0) {
						let productIDS: any = { ...this.single['list'].map(obj => obj.productId) };
						this.SLS.updateShoppinglistItems(this.id, this.listId, productIDS).subscribe((res) => {
							let message: any = this.MS.processModalAlertInformation('success', 'Products have been deleted successfully. ');
							this.MS.data$.next(message);
							this.checked = [];
						});
					}
				} else if (res.type === 'success-movecopy') {
					this.userShoppingListSubscription = this.SLS.userShoppingList(this.id).subscribe((res: any) => {
						if (res) {
							let message: any = this.MS.processModalAlertInformation('process-movecopy', 'confirmed');
							this.MS.data$.next(message);
							this.SLS.shoppingList = res;
							this.SLS.selectedShoppingList = 0;
							this.MS.openSelectListsModal(this.config);
						}
					});
				} else if (res.type === 'success-process-movecopy') {
					let productIDS: any = { ...this.checked.map(obj => obj.productId) };
					this.SLS.updateShoppinglistItems(this.id, this.listId, productIDS).subscribe((res) => {
						// if (res) {
						let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully moved. ');
						this.MS.data$.next(message);
						// }
					}, (error) => {
						let message: any;
						if (error.status === 400) {
							message = this.MS.processModalAlertInformation('danger', 'Product already moved to the list');
						} else {
							message = this.MS.processModalAlertInformation('danger', 'Error when adding product');
						}
						this.MS.data$.next(message);
						if (!environment.production) {
							console.log('Shopping List Error')
						}
					});
				} else if (res.type === 'success-deletelist') {
					this.deleteListSubscription = this.SLS.deleteShoppinglist(this.id, this.listId).subscribe(res => {
						if (res.success) {
							this.route.navigate(['/lists']);
						}
					});
				} else if (res.type === 'success-exportlist') {
					let list: any[] = this.single['list'].map(obj => {
						return {
							'Title': obj.title,
							'UPC': obj.upc,
							'URL': 'https://grceri.com/grocery/' + this.product(obj.title) + '/' + obj.productId,
							'Brand': obj.brand,
							'Price': obj.price
						}
					});
					this.ES.exportAsExcelFile(list, this.single['title']);
				} else {
					if ((res.type === 'success' || res.type === 'danger' || res.type === 'undo-following') && res.value) {
						this.message = [];
						if (res.value) {
							this._message(res.type, res.value, res.linkTitle, res.listId);
						}
					}
				}
			}
		})
	}

	private getListId() {
		this.routerSubscription = this.router.paramMap.subscribe(params => {
			this.listId = params.get('id');
		})
	}

	private getSaved() {
		if (this.id) {
			this.getSavedProductsSubscription = this.US.getSaved(this.id).subscribe((res) => {
				this.user['favorites'] = res;

			});
		} else {
			this.user['favories'] = null;
		}
	}

	private getViewed() {
		if (this.id) {
			this.getViewedProductsSubscription = this.US.getViewedProducts(this.id).subscribe((res) => {
				this.user['viewed'] = res;

			});
		} else {
			this.user['viewed'] = null;
		}
	}

	private getFollowingList() {
		this.SLS.getFollowedLists(this.id).subscribe((res) => {
			this.followingLists = res;

			let followList: any = this.followingLists.find(obj => obj.id === this.listId);
			if (followList) {
				this.followListTitle = false;
			} else {
				this.followListTitle = true;
			}
		})
	}

	private getList() {
		let url = this.router.params['value'].id;

		this.loading = true;

		this.getListSubscription = this.SLS.getList(this.id, url).subscribe(
			(res) => {
				this.single = res;
				this.backupList = res.list;

				this.editMobileListGroup.controls['listTitle'].setValue(this.single['title']);
				this.editMobileListGroup.controls['listDescription'].setValue(this.single['description']);
				this.editDesktopListGroup.controls['desktopListTitle'].setValue(this.single['title']);
				this.editDesktopListGroup.controls['desktopListDescription'].setValue(this.single['description']);

				this.isLoggedIn(res);

				if (this.single['isOwner']) {
					// TITLE
					this.title.setTitle(`${this.single['title']} | My Lists - grceri`);

					this.getSaved();
					this.getViewed();
				} else {
					// TITLE
					this.title.setTitle(`${this.single['title']} | Discover Lists - grceri`);
				}
				this.loading = false;
			},
			(err) => {
				if (!environment.production) {
					console.log('an error has occured', err);
				}

				this.loading = false;
				this.single = [];
			},
			() => {
				this.loading = false;

				if (!environment.production) {
					console.log('single list', this.single);
				}
			});
	}

	shareMobileList($event: any) {
		$event.preventDefault();
		this.NSS.share({
			title: this.title.getTitle(),
			url: this.router.url.toString()
		}).then((response) => {
			console.log(response);

		}).catch((error) => {
			console.log(error);
		});
	}

	editInfo($event): void {
		$event.preventDefault();
		this.editDesktopListInfo = !this.editDesktopListInfo;
	}

	editMobileInfo($event: any): void {
		$event.preventDefault();
		this.editMobileListInfo = !this.editMobileListInfo;
	}

	shareDesktopList($event: any) {
		$event.preventDefault();
	}

	settingsList() {

	}

	viewMobileList() {

	}

	deleteList() {
		let message: any = this.MS.processModalAlertInformation('deletelist', 'Are you sure to delete the list? ');
		this.MS.openConfirmationModal(this.config);
		this.MS.data$.next(message);
	}

	followList($event: any, title: string): any {
		$event.preventDefault();
		if (this.followingLists === undefined) {
			return false;
		}
		this.message = [];
		this.MS.data$.next(undefined);
		if (this.followListTitle) {
			this.followListSubscription = this.SLS.postShoppinglist(this.id, this.listId).subscribe((res) => {
				if (res.success) {
					this.followListTitle = false;
					let message: any = this.MS.processModalAlertInformation('undo-following', 'You have successfully followed ' + title + ' list. ');
					this.MS.data$.next(message);
				}
			});
		} else {
			this.deleteUnfollowListSubscription = this.SLS.deleteShoppinglist(this.id, this.listId).subscribe(res => {
				if (res.success) {
					this.followListTitle = true;
					let message: any = this.MS.processModalAlertInformation('success', 'You have successfully unfollowed ' + title + ' list. ');
					this.MS.data$.next(message);
				}
			});
		}
	}

	exportList() {
		let message: any = this.MS.processModalAlertInformation('exportlist', 'Are you sure to download the list? ');
		this.MS.openConfirmationModal(this.config);
		this.MS.data$.next(message);
	}

	private updateList() {
		let url = this.router.params['value'].id;

		this.updateListSubscription = this.SLS.getList(this.id, url).subscribe(
			(res) => {
				this.single = res;
			});
	}

	addToList(product: any): void {
		this.disableAddToList = true;
		this.MS.data$.next(undefined);
		this.message = [];

		this.updateShoppinglistSubscription = this.SLS.updateShoppinglist(this.id, this.listId, product.productId).subscribe((res) => {
			this.disableAddToList = false;
			if (res) {
				let message: any = this.MS.processModalAlertInformation('success', 'Product has been successfully added. ', product.productId, this.listId);
				this.MS.openMessageModal(this.config);
				this.MS.data$.next(message);
				if (!environment.production) {
					console.log('Shopping List Updated')
				}

				this.updateList();
			}

		}, (error) => {
			let message: any;
			this.disableAddToList = false;
			if (error.status === 400) {
				message = this.MS.processModalAlertInformation('danger', 'Product already added to the list');
			} else {
				message = this.MS.processModalAlertInformation('danger', 'Error when adding product');
			}
			this.MS.openMessageModal(this.config);
			this.MS.data$.next(message);
			if (!environment.production) {
				console.log('Shopping List Error')
			}

		});
	}

	product(i) {
		if (i) {
			return i.toString().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-{2,}/g, '-')
		}
	}

	updateProductList(event: any, product: any): void {
		if (event.currentTarget.checked) {
			this.checked.push(product);
			this.single['list'] = this.single['list'].filter(obj => obj.productId !== product.productId);
		} else {
			this.checked = this.checked.filter(obj => obj.productId !== product.productId);
		}
	}

	deleteAllItems($event: any): any {
		$event.preventDefault();
		if (this.checked.length <= 0) {
			return false;
		}
		let message: any = this.MS.processModalAlertInformation('deleteall', 'Are you sure to delete all items? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);
	}

	selectAll($event: any): any {
		$event.preventDefault();
		if (this.single['list'].length <= 0) {
			return false;
		}
		let message: any = this.MS.processModalAlertInformation('selectall', 'Are you sure to select all items? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);

	}

	deleteCompleted($event: any): void {
		$event.preventDefault();
		let message: any = this.MS.processModalAlertInformation('deletecompleted', 'Are you sure to complete deletion all items? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);
	}

	uncheckAll($event: any): void {
		$event.preventDefault();
		let message: any = this.MS.processModalAlertInformation('uncheckall', 'Are you sure to uncheck all items? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);
	}

	moveCopyItems($event: any): void {
		$event.preventDefault();
		let message: any = this.MS.processModalAlertInformation('movecopy', 'Are you sure to move/copy all items? ');
		this.MS.data$.next(message);
		this.MS.openConfirmationModal(this.config);
	}

	toggleShowCompleted(): void {
		this.hideCompleted = !this.hideCompleted;
	}

	toggleItemChecked(productId: any): boolean {
		let found: any = this.checked.find(obj => obj.productId === productId);

		return found ? true : false;
	}

	removeChecked($event: any, productId: number): void {
		if (!$event.currentTarget.checked) {
			let product: object = this.checked.find(obj => Number(obj.productId) === productId);
			this.single['list'].push(product);
			this.checked = this.checked.filter(obj => Number(obj.productId) !== productId);
		}
	}

	resetEditList(): void {
		this.editMobileListGroup.controls['listTitle'].setValue(this.single['title']);
		this.editMobileListGroup.controls['listDescription'].setValue(this.single['description']);
		this.editMobileListInfo = false;
	}

	resetDesktopEditList(): void {
		this.editDesktopListGroup.controls['desktopListTitle'].setValue(this.single['title']);
		this.editDesktopListGroup.controls['desktopListDescription'].setValue(this.single['description']);
		this.editDesktopListInfo = false;
	}

	updateUserListInfo(): void {
		if (this.editMobileListGroup.valid) {
			let title: any = this.editMobileListGroup.controls['listTitle'].value;
			let description: any = this.editMobileListGroup.controls['listDescription'].value;

			let obj: object = {
				ids: this.backupList.map(obj => obj.productId),
				title,
				description
			};
			if (!environment.production) {
				console.log('obj', obj);
			}
			this.updateMobileListSubscription = this.SLS.updateShoppinglistItems(this.id, this.listId, obj).subscribe((res: any) => {
				if (res.success) {
					let message: any = this.MS.processModalAlertInformation('success', 'List has been updated successfully. ');
					this.MS.data$.next(message);
				}
			});
		}
	}

	updateDesktopUserListInfo(): void {
		if (this.editDesktopListGroup.valid) {
			let title: any = this.editDesktopListGroup.controls['desktopListTitle'].value;
			let description: any = this.editDesktopListGroup.controls['desktopListDescription'].value;

			let obj: object = {
				ids: this.backupList.map(obj => obj.productId),
				title,
				description
			};
			if (!environment.production) {
				console.log('obj', obj);
			}
			this.updateDesktopListSubscription = this.SLS.updateShoppinglistItems(this.id, this.listId, obj).subscribe((res: any) => {
				if (res.success) {
					let message: any = this.MS.processModalAlertInformation('success', 'List has been updated successfully. ');
					this.MS.data$.next(message);
				}
			})
		}
	}
}

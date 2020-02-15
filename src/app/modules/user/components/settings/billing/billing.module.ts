import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// CHILDREN
import { SettingsSubscriptionPlanComponent } from './subscription/plan/plan.component';
import { SettingsSubscriptionUsageComponent } from './subscription/usage/usage.component';
import { SettingsBillingPaymentComponent } from './payment/payment.component';
import { SettingsBillingSubscriptionComponent } from './subscription/subscription.component';
import { SettingsBillingPaymentAccountComponent } from './payment/account/account.component';
import { SettingsBillingPaymentBalanceComponent } from './payment/balance/balance.component';

// BAR RATING
import { BarRatingModule } from 'ngx-bar-rating';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		BarRatingModule,
		BsDropdownModule
	],
	declarations: [
		SettingsBillingPaymentComponent,
		SettingsBillingSubscriptionComponent,
		SettingsSubscriptionPlanComponent,
		SettingsSubscriptionUsageComponent,
		SettingsBillingPaymentAccountComponent,
		SettingsBillingPaymentBalanceComponent
	],
	exports: [
		SettingsBillingPaymentComponent,
		SettingsBillingSubscriptionComponent
	]
})
export class BillingModule { }

import { Injectable } from '@angular/core';

// INTERFACES
import { ISubscription } from '../../interfaces/subscription/subscription.interface';

@Injectable()
export class RegisterService {
  allSubscriptions: ISubscription[];

	constructor() {
  }

  initializeSubscriptions(subscriptions: ISubscription[]): void{
    this.allSubscriptions = subscriptions;
  }

  getQuarterSubscriptions(planType: string, quarterName: string): ISubscription[]{
    let plans: ISubscription[];
    plans = this.getSubscriptions(planType);

    return plans ? plans.filter((element: any) => element.planInterval === quarterName) : [];
  }

  getSubscriptions(subscriptionType: string): ISubscription[] {
		let plans: ISubscription[];

    plans = this.allSubscriptions.filter((element: any) => {
			let productName: string = element.productName;
			return productName.toLowerCase().includes(subscriptionType);
		});

		return plans;
	}
}

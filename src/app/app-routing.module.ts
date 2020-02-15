import { NgModule } from '@angular/core';

// ROUTER
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// SERVICES
import { AuthGuardService } from './shared/services';

// ROUTES
export const ROUTES: Routes = [
	{ path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
	{ path: 'grocery', loadChildren: () => import('./modules/grocery/components/product/product.module').then(m => m.ProductModule) },
	{ path: 'login', loadChildren: () => import('./modules/auth/login/login.module').then(m => m.LoginModule) },
	{ path: 'sign-up', loadChildren: () => import('./modules/auth/register/register.module').then(m => m.RegisterModule) },
	{ path: 'callback', loadChildren: () => import('./modules/auth/callback/callback.module').then(m => m.CallbackModule) },
	{ path: 'forgot-password', loadChildren: () => import('./modules/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
	{ path: 'search', loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule) },
	{ path: 'groceries', loadChildren: () => import('./modules/grocery/grocery.module').then(m => m.GroceryModule) },
	// { path: 'pricing', loadChildren: './modules/pricing/pricing.module#PricingModule' },
	{ path: 'policies', loadChildren: () => import('./modules/policies/policies.module').then(m => m.PoliciesModule) },
	{ path: 'user', loadChildren: () => import('./modules/user/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuardService] },
	{ path: 'user/favorites', loadChildren: () => import('./modules/user/components/favorites/favorites.module').then(m => m.FavoritesModule), canActivate: [AuthGuardService] },
	{ path: 'user/history', loadChildren: () => import('./modules/user/components/history/history.module').then(m => m.HistoryModule), canActivate: [AuthGuardService] },
	{ path: 'user/settings', loadChildren: () => import('./modules/user/components/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuardService] },
	{ path: 'watchlists', loadChildren: () => import('./modules/user/components/watchlist/watchlist.module').then(m => m.WatchlistModule), canActivate: [AuthGuardService] },
	{ path: 'lists', loadChildren: () => import('./modules/user/components/lists/lists.module').then(m => m.ListsModule) },
	{ path: '404', loadChildren: () => import('./modules/404/404.module').then(m => m.NotFoundModule) },
	{ path: '**', redirectTo: '/404' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }

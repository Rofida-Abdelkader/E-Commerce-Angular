import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'store',
    loadComponent: () =>
      import('./features/storefront/components/product-list/product-list').then(
        (m) => m.ProductList,
      ),
  },

  {
    path: 'admin',
    // canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  {
    path: 'cart',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/cart-checkout/cart-checkout.routes').then((m) => m.CART_ROUTES),
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },
  { path: 'auth/login', redirectTo: 'login', pathMatch: 'full' },
  { path: 'auth/register', redirectTo: 'register', pathMatch: 'full' },

  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: '**', redirectTo: 'store' },
];

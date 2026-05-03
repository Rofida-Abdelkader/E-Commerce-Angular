import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'store',
    pathMatch: 'full',
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./features/storefront/storefront.routes').then(
        (m) => m.STOREFRONT_ROUTES
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart-checkout/cart-checkout.routes').then(
        (m) => m.CART_ROUTES
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'store',
  },
];
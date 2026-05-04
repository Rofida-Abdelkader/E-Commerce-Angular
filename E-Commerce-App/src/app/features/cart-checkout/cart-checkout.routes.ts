import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';


export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/cart/cart').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/checkout/checkout').then((m) => m.CheckoutComponent),
  },
];
import { Routes } from '@angular/router';


export const routes: Routes = [
 
  { path: 'store', loadComponent: () => import('./features/store/product-list/product-list').then(m => m.ProductList) },
  
 
  { path: 'admin', loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard) },

  // { path: 'cart', loadComponent: () => import('./features/cart/cart-page/cart-page').then(m => m.CartPage) },
  { path: 'cart', loadChildren: () => import('./features/cart-checkout/cart-checkout.routes').then(m => m.CART_ROUTES) },

  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },

  
  { path: '', redirectTo: 'store', pathMatch: 'full' }
];
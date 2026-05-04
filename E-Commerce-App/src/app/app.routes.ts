import { Routes } from '@angular/router';


export const routes: Routes = [
 
  { path: 'store', loadComponent: () => import('./features/store/product-list/product-list').then(m => m.ProductList) },
  
 
  { path: 'admin', loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard) },

  { path: 'cart', loadComponent: () => import('./features/cart/cart-page/cart-page').then(m => m.CartPage) },

  
  { path: '', redirectTo: 'store', pathMatch: 'full' }
];
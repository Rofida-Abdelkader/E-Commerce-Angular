import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard'; // Ensure this path matches your file structure
import { authGuard } from './core/guards/auth-guard';   // Your standard login guard

export const routes: Routes = [
  // Publicly accessible for viewing, but shopping actions will be blocked in the component
  { 
    path: 'store', 
    loadComponent: () => import('./features/store/product-list/product-list').then(m => m.ProductList) 
  },
  
  // Protected: Only accessible if logged in AND role is 'admin'
  { 
    path: 'admin', 
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard) 
  },

  // { path: 'cart', loadComponent: () => import('./features/cart/cart-page/cart-page').then(m => m.CartPage) },

  // { path: 'cart', loadChildren: () => import('./features/cart-checkout/cart-checkout.routes').then(m => m.CART_ROUTES) },

  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },

  // Protected: Only accessible if the user is logged in
  { 
    path: 'cart', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart-page/cart-page').then(m => m.CartPage) 
  },

  // Auth Routes
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) 
  },

  // Default Redirection
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  
  // Wildcard for 404 or unknown paths
  { path: '**', redirectTo: 'store' }
];
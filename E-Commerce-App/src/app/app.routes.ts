import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { OrderTrackingComponent } from './features/orders/components/order-tracking/order-tracking';
import { AdminOrdersComponent } from './features/admin/components/admin-orders/admin-orders';
import { ProductListComponent } from './features/admin/products/product-list/product-list';
import { ProductFormComponent } from './features/admin/products/product-form/product-form';
import { CategoryListComponent } from './features/admin/categories/category-list/category-list';
import { CategoryFormComponent } from './features/admin/categories/category-form/category-form';

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
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/components/order-tracking/order-tracking').then(
        (m) => m.OrderTrackingComponent,
      ),
  },

 { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrderTrackingComponent },
  { path: 'admin', component: AdminOrdersComponent },

   // Products
  { path: 'admin/products', component: ProductListComponent },
  { path: 'admin/products/new', component: ProductFormComponent },
  { path: 'admin/products/edit/:id', component: ProductFormComponent },

  // Categories
  { path: 'admin/categories', component: CategoryListComponent },
  { path: 'admin/categories/new', component: CategoryFormComponent },
  { path: 'admin/categories/edit/:id', component: CategoryFormComponent },

  
  { path: 'auth/login', redirectTo: 'login', pathMatch: 'full' },
  { path: 'auth/register', redirectTo: 'register', pathMatch: 'full' },

  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: '**', redirectTo: 'store' },
];

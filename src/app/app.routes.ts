import { Routes } from '@angular/router';
import { OrderTrackingComponent } from './features/orders/components/order-tracking/order-tracking';
import { AdminOrdersComponent } from './features/admin/components/admin-orders/admin-orders';
import { ProductListComponent } from './features/admin/products/product-list/product-list';
import { ProductFormComponent } from './features/admin/products/product-form/product-form';
import { CategoryListComponent } from './features/admin/categories/category-list/category-list';
import { CategoryFormComponent } from './features/admin/categories/category-form/category-form';

export const routes: Routes = [
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
];
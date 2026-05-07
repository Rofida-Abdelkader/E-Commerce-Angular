import { Routes } from '@angular/router';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminOrdersComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/category-list/category-list').then((m) => m.CategoryListComponent),
      },
      {
        path: 'categories/add',
        loadComponent: () =>
          import('./categories/category-form/category-form').then((m) => m.CategoryFormComponent),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./categories/category-form/category-form').then((m) => m.CategoryFormComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list/product-list').then((m) => m.ProductListComponent),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./products/product-form/product-form').then((m) => m.ProductFormComponent),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./products/product-form/product-form').then((m) => m.ProductFormComponent),
      },
    ],
  },
];

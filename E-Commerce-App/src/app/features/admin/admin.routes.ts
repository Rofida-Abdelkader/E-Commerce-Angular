import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/category-list/category-list').then(
            (m) => m.CategoryListComponent
          ),
      },
      {
        path: 'categories/add',
        loadComponent: () =>
          import('./pages/categories/category-form/category-form').then(
            (m) => m.CategoryFormComponent
          ),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./pages/categories/category-form/category-form').then(
            (m) => m.CategoryFormComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/product-list/product-list').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./pages/products/product-form/product-form').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/products/product-form/product-form').then(
            (m) => m.ProductFormComponent
          ),
      },
    ],
  },
];
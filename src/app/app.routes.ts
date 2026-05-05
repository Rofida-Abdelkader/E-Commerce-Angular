import { Routes } from '@angular/router';
import { OrderTrackingComponent } from './features/orders/components/order-tracking/order-tracking';
import { AdminOrdersComponent } from './features/admin/components/admin-orders/admin-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrderTrackingComponent },
  { path: 'admin', component: AdminOrdersComponent },
];
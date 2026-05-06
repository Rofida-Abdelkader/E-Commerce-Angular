import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Order, OrderFilters, OrdersResponse, OrderStats, OrderStatus,
} from '../../../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getOrders(filters: OrderFilters): Observable<OrdersResponse> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`).pipe(
      map((orders) => {
        let filtered = [...orders];

        if (filters.status)
          filtered = filtered.filter(o => o.status === filters.status);

        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(o =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q)
          );
        }

        const totalCount = filtered.length;
        const start = (filters.page - 1) * filters.pageSize;
        const paged = filtered.slice(start, start + filters.pageSize);

        return {
          orders: paged,
          total: totalCount,
          page: filters.page,
          pageSize: filters.pageSize,
          totalPages: Math.ceil(totalCount / filters.pageSize),
        };
      })
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    // PATCH عشان نحدث الحالة فقط في السيرفر
    return this.http.patch<Order>(`${this.baseUrl}/orders/${id}`, { status });
  }

  getOrderByNumber(orderNumber: string): Observable<Order | undefined> {
  return this.http.get<Order[]>(`${this.baseUrl}/orders?orderNumber=${orderNumber}`).pipe(
    map(orders => orders[0])
  );
}

  getOrderStats(): Observable<OrderStats> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`).pipe(
      map((orders) => {
        const today = new Date().toDateString();
        const todayOrdersList = orders.filter(o => 
          o.createdAt && new Date(o.createdAt).toDateString() === today
        );

        return {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          processingOrders: orders.filter(o => o.status === 'processing').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
          totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
          avgOrderValue: orders.length ? orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length : 0,
          todayOrders: todayOrdersList.length,
          todayRevenue: todayOrdersList.reduce((s, o) => s + (o.total || 0), 0),
        } as OrderStats;
      })
    );
  }
}
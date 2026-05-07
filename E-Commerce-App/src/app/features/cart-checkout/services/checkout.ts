import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CheckoutData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  items: any[];
  totalPrice: number;
  customer: CheckoutData;
  paymentMethod: 'cash' | 'cash_on_delivery' | 'credit_card';
  status: 'pending';
  orderNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<any> {
    const orderWithNumber = {
      orderNumber: `ORD-${Date.now()}`,
      items: order.items.map((item) => ({
        id: `${item.productId}-${Date.now()}`,
        productId: String(item.productId),
        productName: item.title,
        productImage: item.image,
        sku: `SKU-${item.productId}`,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),
      shippingAddress: {
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        street: order.customer.address,
        city: order.customer.city,
        state: '',
        country: 'Egypt',
        postalCode: '',
      },
      subtotal: order.totalPrice,
      total: order.totalPrice,
      shippingFee: 0,
      tax: 0,
      discount: 0,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentMethod === 'credit_card' ? 'paid' : 'unpaid',
      status: 'pending',
      trackingEvents: [],
      createdAt: new Date().toISOString(),
    };
    return this.http.post(this.apiUrl, orderWithNumber);
  }
}

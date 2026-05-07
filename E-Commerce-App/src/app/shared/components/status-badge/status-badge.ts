import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OrderStatus,
  PaymentStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '../../../core/models/order.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  @Input() orderStatus?: OrderStatus;
  @Input() paymentStatus?: PaymentStatus;
  @Input() type: 'order' | 'payment' = 'order';

  get label(): string {
    if (this.type === 'order' && this.orderStatus) return ORDER_STATUS_LABELS[this.orderStatus];
    if (this.type === 'payment' && this.paymentStatus)
      return this.paymentStatus.charAt(0).toUpperCase() + this.paymentStatus.slice(1);
    return '';
  }

  get bgColor(): string {
    if (this.type === 'order' && this.orderStatus)
      return ORDER_STATUS_COLORS[this.orderStatus] + '20';
    const map: Record<string, string> = {
      paid: '#10B98120',
      unpaid: '#F59E0B20',
      refunded: '#6B728020',
      failed: '#EF444420',
    };
    return this.paymentStatus ? map[this.paymentStatus] : '#6B728020';
  }

  get textColor(): string {
    if (this.type === 'order' && this.orderStatus) return ORDER_STATUS_COLORS[this.orderStatus];
    const map: Record<string, string> = {
      paid: '#10B981',
      unpaid: '#F59E0B',
      refunded: '#6B7280',
      failed: '#EF4444',
    };
    return this.paymentStatus ? map[this.paymentStatus] : '#6B7280';
  }
}

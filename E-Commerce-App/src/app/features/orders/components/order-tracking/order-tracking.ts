import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Order, TrackingEvent, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../../../core/models/order.model';
import { OrderService } from '../../services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe, StatusBadgeComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-tracking.html',
  styleUrls: ['./order-tracking.css'],
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  searchQuery = '';
  order: Order | null = null;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();
  
  progressSteps = [
    { label: 'Order Placed', icon: '📝', status: 'pending',    done: false, active: false, color: '#F59E0B' },
    { label: 'Confirmed',    icon: '✅', status: 'confirmed',   done: false, active: false, color: '#3B82F6' },
    { label: 'Processing',   icon: '⚙️', status: 'processing',  done: false, active: false, color: '#8B5CF6' },
    { label: 'Shipped',      icon: '🚚', status: 'shipped',     done: false, active: false, color: '#06B6D4' },
    { label: 'Delivered',    icon: '🏠', status: 'delivered',   done: false, active: false, color: '#10B981' },
  ];

  constructor(
    private orderService: OrderService, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { 
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['orderNumber']) {
        this.searchQuery = params['orderNumber'];
        this.trackOrder();
      }
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  trackOrder(): void {
    if (!this.searchQuery.trim()) { this.error = 'Please enter an order number.'; return; }
    this.loading = true; this.error = ''; this.order = null;
    this.orderService.getOrderByNumber(this.searchQuery.trim().toUpperCase())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.loading = false;
          if (!order) this.error = `No order found. Try ${this.searchQuery}.`;
          else { this.order = order; this.updateProgress(order); }
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; this.error = 'Something went wrong.'; this.cdr.markForCheck(); },
      });
  }

  get sortedEvents(): TrackingEvent[] {
    return this.order
      ? [...this.order.trackingEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      : [];
  }

  getStatusLabel(status: string): string { return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status; }
  getStatusColor(status: string): string { return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || '#6B7280'; }
  
  formatPaymentMethod(method: string): string {
    const map: Record<string, string> = {
      credit_card: '💳 Credit Card', debit_card: '💳 Debit Card',
      paypal: '🅿️ PayPal', cash_on_delivery: '💵 Cash on Delivery', bank_transfer: '🏦 Bank Transfer',
    };
    return map[method] || method;
  }

  private updateProgress(order: Order): void {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    this.progressSteps = this.progressSteps.map((s, i) => ({ ...s, done: i < currentIdx, active: i === currentIdx }));
  }
}
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Order, OrderFilters, OrderStats, OrderStatus, ORDER_STATUS_LABELS } from '../../../../core/models/order.model';
import { OrderService } from '../../../orders/services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, DecimalPipe, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  stats: OrderStats | null = null;
  totalOrders = 0;
  totalPages = 1;
  currentPage = 1;
  readonly pageSize = 8;
  tableLoading = false;
  searchQuery = '';
  statusFilter = '';
  selectedOrders = new Set<string>();
  allSelected = false;
  selectedOrder: Order | null = null;
  today = new Date();

  readonly statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));
  readonly ORDER_STATUS_LABELS = ORDER_STATUS_LABELS;

  private destroy$ = new Subject<void>();
  private searchTimer: any;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { 
    this.loadStats(); 
    this.loadOrders(); 
  }

  ngOnDestroy(): void { 
    this.destroy$.next(); 
    this.destroy$.complete(); 
    clearTimeout(this.searchTimer); 
  }

  loadStats(): void {
    this.orderService.getOrderStats().pipe(takeUntil(this.destroy$)).subscribe((s) => {
      this.stats = s; 
      this.cdr.markForCheck();
    });
  }

  loadOrders(): void {
    this.tableLoading = true;
    const filters: OrderFilters = {
      page: this.currentPage, 
      pageSize: this.pageSize,
      search: this.searchQuery || undefined,
      status: (this.statusFilter as OrderStatus) || undefined,
    };
    this.orderService.getOrders(filters).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.orders = res.orders;
      this.totalOrders = res.total;
      this.totalPages = res.totalPages;
      this.tableLoading = false;
      this.cdr.markForCheck();
    });
  }

  changeStatus(order: Order, newStatus: string): void {
    const status = newStatus as OrderStatus;
    console.log(`Changing order ${order.id} status to ${status}`);

    this.orderService.updateOrderStatus(order.id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => {
          console.log('Status updated successfully:', updatedOrder);
          // Update the selected order if it's the same one
          if (this.selectedOrder?.id === order.id) {
            this.selectedOrder = { ...this.selectedOrder, status: status };
          }
          // Update the order in the main list
          const orderIndex = this.orders.findIndex(o => o.id === order.id);
          if (orderIndex !== -1) {
            this.orders[orderIndex] = { ...this.orders[orderIndex], status: status };
          }
          // Reload data to ensure consistency
          this.loadOrders();
          this.loadStats();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to update order status:', error);
          // You could add a toast notification here
        }
      });
  }

  // باقي الدوال (Pagination, Search, etc.) كما هي في كودك الأصلي
  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage = 1; this.loadOrders(); }, 350);
  }
  onFilterChange(): void { this.currentPage = 1; this.loadOrders(); }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) { this.currentPage = page; this.loadOrders(); }
  }
  viewOrder(order: Order): void { this.selectedOrder = order; this.cdr.markForCheck(); }
  closeDrawer(): void { this.selectedOrder = null; this.cdr.markForCheck(); }
  toggleAll(): void {
    this.allSelected ? this.orders.forEach(o => this.selectedOrders.add(o.id)) : this.selectedOrders.clear();
    this.cdr.markForCheck();
  }
  toggleOrder(id: string): void {
    this.selectedOrders.has(id) ? this.selectedOrders.delete(id) : this.selectedOrders.add(id);
    this.allSelected = this.selectedOrders.size === this.orders.length;
    this.cdr.markForCheck();
  }
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++)
      pages.push(i);
    return pages;
  }
}
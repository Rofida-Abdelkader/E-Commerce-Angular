import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Order, OrderFilters, OrderStats, OrderStatus, ORDER_STATUS_LABELS } from '../../../../core/models/order.model';
import { OrderService } from '../../../orders/services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe, StatusBadgeComponent],
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

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++)
      pages.push(i);
    return pages;
  }

  private destroy$ = new Subject<void>();
  private searchTimer: any;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadStats(); this.loadOrders(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); clearTimeout(this.searchTimer); }

  loadStats(): void {
    this.orderService.getOrderStats().pipe(takeUntil(this.destroy$)).subscribe((s) => {
      this.stats = s; this.cdr.markForCheck();
    });
  }

  loadOrders(): void {
    this.tableLoading = true;
    const filters: OrderFilters = {
      page: this.currentPage, pageSize: this.pageSize,
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

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage = 1; this.loadOrders(); }, 350);
  }

  onFilterChange(): void { this.currentPage = 1; this.loadOrders(); }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) { this.currentPage = page; this.loadOrders(); }
  }

  toggleAll(): void {
    if (this.allSelected) this.orders.forEach((o) => this.selectedOrders.add(o.id));
    else this.selectedOrders.clear();
    this.cdr.markForCheck();
  }

  toggleOrder(id: string): void {
    this.selectedOrders.has(id) ? this.selectedOrders.delete(id) : this.selectedOrders.add(id);
    this.allSelected = this.selectedOrders.size === this.orders.length;
    this.cdr.markForCheck();
  }

  viewOrder(order: Order): void { this.selectedOrder = order; this.cdr.markForCheck(); }
  closeDrawer(): void { this.selectedOrder = null; this.cdr.markForCheck(); }

  changeStatus(order: Order, status: string): void {
    this.orderService.updateOrderStatus(order.id, status as OrderStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedOrder?.id === order.id)
          this.selectedOrder = { ...this.selectedOrder, status: status as OrderStatus };
        this.loadOrders(); this.loadStats();
      });
  }
}
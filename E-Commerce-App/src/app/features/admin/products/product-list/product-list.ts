import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product, Category, ProductFilters } from '../../../../core/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  totalProducts = 0;
  totalPages = 1;
  currentPage = 1;
  readonly pageSize = 8;
  loading = false;
  searchQuery = '';
  categoryFilter = '';
  selectedProduct: Product | null = null;
  showDeleteModal = false;
  productToDelete: Product | null = null;

  private destroy$ = new Subject<void>();
  private searchTimer: any;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.searchTimer);
  }

  loadCategories(): void {
    this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
      this.categories = cats;
      this.cdr.markForCheck();
    });
  }

  loadProducts(): void {
    this.loading = true;
    const filters: ProductFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchQuery || undefined,
      category: this.categoryFilter || undefined,
    };
    this.productService.getProducts(filters).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.products = res.products;
      this.totalProducts = res.total;
      this.totalPages = res.totalPages;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage = 1; this.loadProducts(); }, 350);
  }

  onFilterChange(): void { this.currentPage = 1; this.loadProducts(); }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) { this.currentPage = page; this.loadProducts(); }
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;
    this.productService.deleteProduct(this.productToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showDeleteModal = false;
        this.productToDelete = null;
        this.loadProducts();
        this.cdr.markForCheck();
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
    this.cdr.markForCheck();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++)
      pages.push(i);
    return pages;
  }
}
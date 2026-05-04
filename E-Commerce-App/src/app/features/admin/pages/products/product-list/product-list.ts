import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../../core/services/product';
import { CategoryService } from '../../../../../core/services/category';
import { Product } from '../../../../../core/models/product';
import { Category } from '../../../../../core/models/category';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: () => this.error = 'Failed to load categories'
    });
  }

  loadProducts() {
    this.loading = true;
    const obs = this.selectedCategoryId
      ? this.productService.getByCategory(this.selectedCategoryId)
      : this.productService.getAll();

    obs.subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value ? +value : null;
    this.loadProducts();
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.id === categoryId)?.name ?? '-';
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: () => this.error = 'Failed to delete product'
    });
  }
}
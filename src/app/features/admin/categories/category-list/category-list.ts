import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../../../core/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading = false;
  showDeleteModal = false;
  categoryToDelete: Category | null = null;

  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadCategories(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadCategories(): void {
    this.loading = true;
    this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
      this.categories = cats;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  confirmDelete(cat: Category): void {
    this.categoryToDelete = cat;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  deleteCategory(): void {
    if (!this.categoryToDelete) return;
    this.productService.deleteCategory(this.categoryToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showDeleteModal = false;
        this.categoryToDelete = null;
        this.loadCategories();
        this.cdr.markForCheck();
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
    this.cdr.markForCheck();
  }
}
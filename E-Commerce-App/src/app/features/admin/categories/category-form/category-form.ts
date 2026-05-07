import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isEdit = false;
  categoryId: string | null = null;
  loading = false;
  submitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) { this.isEdit = true; this.loadCategory(this.categoryId); }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.form.get('name')?.valueChanges.subscribe(val => {
      if (!this.isEdit)
        this.form.get('slug')?.setValue(val.toLowerCase().replace(/\s+/g, '-'), { emitEvent: false });
    });
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
      const cat = cats.find(c => c.id === id);
      if (cat) this.form.patchValue({ name: cat.name, slug: cat.slug });
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const value = this.form.value;

    const request$ = this.isEdit
      ? this.productService.updateCategory(this.categoryId!, value)
      : this.productService.addCategory({ ...value, productCount: 0 });

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.submitting = false; this.router.navigate(['/admin/categories']); },
      error: () => { this.submitting = false; this.cdr.markForCheck(); },
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
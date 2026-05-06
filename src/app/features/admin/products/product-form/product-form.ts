import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Category } from '../../../../core/models/product.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './product-form.html',
    styleUrl: './product-form.css',
})
export class ProductFormComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    categories: Category[] = [];
    isEdit = false;
    productId: string | null = null;
    loading = false;
    submitting = false;
    imagePreview = '';

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.loadCategories();
        this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) { this.isEdit = true; this.loadProduct(this.productId); }
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    buildForm(): void {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            price: [null, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            category: ['', Validators.required],
            image: ['', Validators.required],
        });

        this.form.get('image')?.valueChanges.subscribe(val => {
            this.imagePreview = val;
            this.cdr.markForCheck();
        });
    }

    loadCategories(): void {
        this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
            this.categories = cats;
            this.cdr.markForCheck();
        });
    }

    loadProduct(id: string): void {
        this.loading = true;
        this.productService.getProductById(id).pipe(takeUntil(this.destroy$)).subscribe(product => {
            this.form.patchValue({
                title: product.title,
                price: product.price,
                stock: product.stock ?? 0,
                description: product.description,
                category: product.category,
                image: product.image,
            });
            this.imagePreview = product.image;
            this.loading = false;
            this.cdr.markForCheck();
        });
    }

    onSubmit(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.submitting = true;
        const value = this.form.value;
        const productData = { ...value, rating: { rate: 0, count: 0 } };

        const request$ = this.isEdit
            ? this.productService.updateProduct(this.productId!, value)
            : this.productService.addProduct(productData);

        request$.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => { this.submitting = false; this.router.navigate(['/admin/products']); },
            error: () => { this.submitting = false; this.cdr.markForCheck(); },
        });
    }

    isInvalid(field: string): boolean {
        const c = this.form.get(field);
        return !!(c?.invalid && c?.touched);
    }
}
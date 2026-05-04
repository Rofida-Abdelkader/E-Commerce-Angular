import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../../core/services/product';
import { CategoryService } from '../../../../../core/services/category';
import { Category } from '../../../../../core/models/category';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  productId!: number;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, Validators.required],
      image: [null]
    });
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: () => this.error = 'Failed to load categories'
    });

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEdit = true;
      this.productService.getById(this.productId).subscribe({
        next: (product) => {
          this.form.patchValue(product);
          this.imagePreview = product.imageUrl;
        },
        error: () => this.error = 'Failed to load product'
      });
    }
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
  get price() { return this.form.get('price'); }
  get categoryId() { return this.form.get('categoryId'); }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('price', this.form.value.price);
    formData.append('categoryId', this.form.value.categoryId);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const action = this.isEdit
      ? this.productService.update(this.productId, formData)
      : this.productService.create(formData);

    action.subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => {
        this.error = 'Failed to save product';
        this.loading = false;
      }
    });
  }
}
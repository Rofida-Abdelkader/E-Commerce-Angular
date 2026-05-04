import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../../core/services/category';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  categoryId!: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params['id'];
    if (this.categoryId) {
      this.isEdit = true;
      this.categoryService.getById(this.categoryId).subscribe({
        next: (cat) => this.form.patchValue(cat),
        error: () => this.error = 'Failed to load category'
      });
    }
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    const action = this.isEdit
      ? this.categoryService.update(this.categoryId, this.form.value)
      : this.categoryService.create(this.form.value);

    action.subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: () => {
        this.error = 'Failed to save category';
        this.loading = false;
      }
    });
  }
}
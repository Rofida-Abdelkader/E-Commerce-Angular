import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin } from 'rxjs';
import { Product, Category, ProductFilters, ProductsResponse } from '../../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ─── Products ───────────────────────────────────────────
  getProducts(filters: ProductFilters): Observable<ProductsResponse> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
      map((products) => {
        let filtered = [...products];

        if (filters.category)
          filtered = filtered.filter(p => p.category === filters.category);

        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }

        const total = filtered.length;
        const start = (filters.page - 1) * filters.pageSize;
        const paged = filtered.slice(start, start + filters.pageSize);

        return {
          products: paged,
          total,
          page: filters.page,
          pageSize: filters.pageSize,
          totalPages: Math.ceil(total / filters.pageSize),
        };
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product).pipe(
      switchMap((newProduct) =>
        this.updateCategoryCount(newProduct.category, 1).pipe(
          map(() => newProduct)
        )
      )
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    // لو الكاتيجوري اتغيرت، نحدث العدد في الاتنين
    if (product.category) {
      return this.getProductById(id).pipe(
        switchMap((oldProduct) =>
          forkJoin([
            this.updateCategoryCount(oldProduct.category, -1),
            this.updateCategoryCount(product.category!, 1),
          ]).pipe(
            switchMap(() =>
              this.http.put<Product>(`${this.baseUrl}/products/${id}`, product)
            )
          )
        )
      );
    }
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.getProductById(id).pipe(
      switchMap((product) =>
        this.http.delete<void>(`${this.baseUrl}/products/${id}`).pipe(
          switchMap(() => this.updateCategoryCount(product.category, -1).pipe(
            map(() => void 0)
          ))
        )
      )
    );
  }

  // ─── Categories ─────────────────────────────────────────
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  // ─── Helper: تحديث عدد المنتجات في الكاتيجوري ──────────
  private updateCategoryCount(categorySlug: string, delta: number): Observable<Category> {
    return this.getCategories().pipe(
      switchMap((cats) => {
        const cat = cats.find(c => c.slug === categorySlug);
        if (!cat) return this.getCategories().pipe(map(c => c[0]));
        const updated = { ...cat, productCount: Math.max(0, (cat.productCount || 0) + delta) };
        return this.http.put<Category>(`${this.baseUrl}/categories/${cat.id}`, updated);
      })
    );
  }
}
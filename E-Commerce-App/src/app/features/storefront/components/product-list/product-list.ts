import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card';
import { SearchBarComponent } from '../search-bar/search-bar';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SearchBarComponent,
    FilterSidebarComponent,
    CartSidebarComponent
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {

  products$: Observable<Product[]>;

  cart: CartItem[] = [];

  showCart = false;

  searchTerm = '';
  category = '';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();

    const saved = localStorage.getItem('cart');
    this.cart = saved ? JSON.parse(saved) : [];
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  onAddToCart(product: Product) {

    const existing = this.cart.find(
      item => item.product.id === product.id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        product,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));

    this.showCart = true;
  }

  onSearch(value: string) {
    this.searchTerm = value;
  }

  onCategory(value: string) {
    this.category = value;
  }

  filterProducts(products: Product[]) {
    return products.filter(p => {

      const matchSearch =
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategory =
        !this.category || p.category === this.category;

      return matchSearch && matchCategory;
    });
  }

  getCartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}
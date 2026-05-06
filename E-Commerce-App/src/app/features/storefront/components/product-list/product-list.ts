import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card';
import { SearchBarComponent } from '../search-bar/search-bar';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar';
import { CartService } from '../../../cart-checkout/services/cart';

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
  private cartService = inject(CartService);
  
  get cart() {
    return this.cartService.items();
  }
  
  showCart = false;
  searchTerm = '';
  category = '';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart({ product, quantity: 1 });
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
      const matchSearch = p.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = !this.category || p.category === this.category;
      return matchSearch && matchCategory;
    });
  }

  getCartCount(): number {
    return this.cartService.totalQuantity();
  }

  increaseQty(productId: number) {
    const item = this.cart.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQty(productId: number) {
    const item = this.cart.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity - 1);
  }
}
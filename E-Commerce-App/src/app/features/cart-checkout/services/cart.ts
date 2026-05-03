import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem } from '../../../core/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  items = this.cartItems.asReadonly();

  totalQuantity = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  addToCart(product: CartItem): void {
    const existing = this.cartItems().find(i => i.productId === product.productId);
    if (existing) {
      this.cartItems.update(items =>
        items.map(i =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      this.cartItems.update(items => [...items, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getCart(): Cart {
    return {
      items: this.cartItems(),
      totalQuantity: this.totalQuantity(),
      totalPrice: this.totalPrice()
    };
  }
}
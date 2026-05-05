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
    this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  addToCart(item: CartItem): void {
    const existing = this.cartItems().find(i => i.product.id === item.product.id);
    if (existing) {
      this.cartItems.update(items =>
        items.map(i =>
          i.product.id === item.product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      this.cartItems.update(items => [...items, { ...item, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
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
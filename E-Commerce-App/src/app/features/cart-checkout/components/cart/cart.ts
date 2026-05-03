import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  increaseQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decreaseQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  goToCheckout(): void {
    this.router.navigate(['/cart/checkout']);
  }
}
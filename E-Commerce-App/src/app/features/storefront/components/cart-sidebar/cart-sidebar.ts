import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItem } from '../../model/cart.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss'
})
export class CartSidebarComponent {
     
  @Output() increase = new EventEmitter<number>();
@Output() decrease = new EventEmitter<number>();
@Output() close = new EventEmitter<void>();

  @Input() cart: CartItem[] = [];
  @Input() visible = false;
  
  constructor(private router: Router) {}

  getTotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
  goToCheckout() {
    this.close.emit();
    this.router.navigate(['/cart/checkout']);
  }
}
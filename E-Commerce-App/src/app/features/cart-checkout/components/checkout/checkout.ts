import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CheckoutService } from '../../services/checkout';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);

  checkoutForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    notes: ['']
  });

  isSubmitting = false;

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const order = {
      items: this.cartService.items().map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      totalPrice: this.cartService.totalPrice(),
      customer: this.checkoutForm.value,
      paymentMethod: 'cash' as const,
      status: 'pending' as const
    };

    this.checkoutService.placeOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
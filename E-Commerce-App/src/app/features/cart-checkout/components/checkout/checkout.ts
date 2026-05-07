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
    phone: ['', [Validators.required, Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    notes: [''],
    paymentMethod: ['cash', Validators.required],
    cardNumber: [''],
    expiryDate: [''],
    cvv: [''],
    cardHolder: [''],
  });

  constructor() {
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardHolder'];

      if (method === 'credit_card') {
        this.checkoutForm
          .get('cardNumber')
          ?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        this.checkoutForm
          .get('expiryDate')
          ?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        this.checkoutForm
          .get('cvv')
          ?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
        this.checkoutForm.get('cardHolder')?.setValidators([Validators.required]);
      } else {
        cardFields.forEach((field) => {
          this.checkoutForm.get(field)?.clearValidators();
          this.checkoutForm.get(field)?.reset();
        });
      }

      cardFields.forEach((field) => {
        this.checkoutForm.get(field)?.updateValueAndValidity();
      });
    });
  }

  isSubmitting = false;

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const order = {
      items: this.cartService.items().map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      totalPrice: this.cartService.totalPrice(),
      customer: {
        fullName: this.checkoutForm.value.fullName,
        phone: this.checkoutForm.value.phone,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        notes: this.checkoutForm.value.notes,
      },
      paymentMethod: (this.checkoutForm.value.paymentMethod === 'cash'
        ? 'cash_on_delivery'
        : 'credit_card') as 'cash' | 'cash_on_delivery' | 'credit_card',
      status: 'pending' as const,
      paymentStatus: this.checkoutForm.value.paymentMethod === 'credit_card' ? 'paid' : 'unpaid',
    };

    this.checkoutService.placeOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();

        // حفظ الـ order في localStorage
        const savedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        savedOrders.push({
          orderNumber: response.orderNumber,
          date: new Date().toISOString(),
          total: response.totalPrice,
          status: response.status,
        });
        localStorage.setItem('user_orders', JSON.stringify(savedOrders));

        this.router.navigate(['/orders'], {
          queryParams: { orderNumber: response.orderNumber },
        });
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}

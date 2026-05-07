import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

 onSubmit() {
  const { email, password } = this.loginForm.value;
  const registeredUser = JSON.parse(localStorage.getItem('registered_user') || 'null');

  if (!registeredUser) {
    alert("No account found. Please register first!");
    this.router.navigate(['/register']);
    return;
  }

  if (email === registeredUser.email && password === registeredUser.password) {
    this.authService.login(registeredUser.role); 
    
    
    if (registeredUser.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/store']);
    }
  } else {
    alert("Invalid email or password");
  }
}
}
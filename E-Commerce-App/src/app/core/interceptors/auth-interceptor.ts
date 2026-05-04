import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Make sure the path is correct

export const adminGuard: CanActivateFn = (route, state) => {
  // Pass AuthService inside inject() to fix the 'unknown' type error
  const authService = inject(AuthService); 
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getUserRole() === 'admin') {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
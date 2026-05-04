import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = localStorage.getItem('user_role'); 

  if (authService.isLoggedIn() && role === 'admin') {
    return true;
  }

  alert("Access Denied: Admins Only!");
  router.navigate(['/store']); 
  return false;
};
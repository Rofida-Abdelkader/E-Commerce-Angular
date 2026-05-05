import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'app_token';
  private userKey = 'registered_user';
  
  // Using signals for reactive state management
  currentUser = signal<any>(null);

  registerUser(userData: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  getRegisteredUser(): any {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  login(role: string): void {
    localStorage.setItem(this.tokenKey, 'fake-jwt-token');
    localStorage.setItem('user_role', role);
  }

  logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }
}
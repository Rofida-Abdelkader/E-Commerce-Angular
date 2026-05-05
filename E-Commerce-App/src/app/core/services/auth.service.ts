import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = signal<any>(null);

  constructor() { }

 
  login(token: string) {
    localStorage.setItem('userToken', token);
    this.currentUser.set({ name: 'User', role: 'admin' }); 
  }

  logout() {
    localStorage.removeItem('userToken');
    this.currentUser.set(null);
  }
}
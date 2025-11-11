import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  admin = signal<boolean>(this.getAdminStateFromStorage());

  loginAsAdmin() {
    this.admin.set(true);
    localStorage.setItem('isAdmin', 'true');
  }

  logout() {
    this.admin.set(false);
    localStorage.removeItem('isAdmin');
  }

  isAdmin() {
    return this.admin();
  }

  private getAdminStateFromStorage(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }
}

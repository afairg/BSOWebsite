import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminLogin {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post('https://bso.swollenhippo.com/backend/admin_login.php', { username, password });
  }
}

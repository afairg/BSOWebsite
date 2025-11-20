import { Component, output, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsoNavBar } from "../components/bso-nav-bar/bso-nav-bar";
import { Auth } from '../services/auth';
import { FormsModule } from '@angular/forms';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Importing Bootswatch Lux theme CSS}
import { AdminLogin } from '../services/admin-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BsoNavBar, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bso-website');

  admin = signal<boolean>(false);
  successful = output<boolean>();
  username = '';
  password = '';
  errorMessage = '';

  constructor(public authService: Auth, private loginService: AdminLogin) {}

  onLogin() {
    this.successful.subscribe((isSuccessful: boolean) => {
      if (isSuccessful) {
        this.authService.loginAsAdmin();
      }
    })
  }
  
  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        if (response.message === 'Login successful.') {
          this.successful.emit(true);
        } else {
          this.successful.emit(false);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }

  onCancel() {
    this.successful.emit(false);
  }

  onLogout() {
    this.authService.logout();
  }
}
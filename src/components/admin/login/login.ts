import { Component, output, signal } from '@angular/core';
import { AdminLogin } from '../../../services/admin-login';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  successful = output<boolean>();
  username = '';
  password = '';
  errorMessage = '';

  constructor(private loginService: AdminLogin, public activeModal: NgbActiveModal) {}

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
    this.activeModal.dismiss();
  }
}

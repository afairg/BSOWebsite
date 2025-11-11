import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsoNavBar } from "../components/bso-nav-bar/bso-nav-bar";
import { Login } from '../components/admin/login/login';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Auth } from '../services/auth';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Importing Bootswatch Lux theme CSS}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BsoNavBar, NgbModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bso-website');

  admin = signal<boolean>(false);

  constructor(private modalService: NgbModal, public authService: Auth) {}
  
  openLoginModal() {
    const modalRef = this.modalService.open(Login, { centered: true });
    modalRef.componentInstance.successful.subscribe((isSuccessful: boolean) => {
      if (isSuccessful) {
        this.authService.loginAsAdmin();
        console.log('Admin logged in successfully');
        this.modalService.dismissAll();
      } else {
        console.log('Login failed or canceled');
      }
    })
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with:', result);
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }
}
import { Component } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-bso-nav-bar',
  imports: [],
  templateUrl: './bso-nav-bar.html',
  styleUrl: './bso-nav-bar.css'
})
export class BsoNavBar {
  constructor(public authService: Auth) {}
}

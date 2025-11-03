import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsoNavBar } from "../components/bso-nav-bar/bso-nav-bar";
import 'bootswatch/dist/lux/bootstrap.min.css'; // Importing Bootswatch Lux theme CSS}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BsoNavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bso-website');
}
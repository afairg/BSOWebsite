import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsoNavBar } from "../components/bso-nav-bar/bso-nav-bar";
import { HeroImage } from "../components/hero-image/hero-image";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BsoNavBar, HeroImage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bso-website');

  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ message: string }>('http://localhost:3000/api/hello').subscribe(res => this.message = res.message);
  }
}
import { Component, signal } from '@angular/core';
import { MagazineService, Magazine } from '../../services/magazine';
import { SafeUrlPipe } from '../../pipes/safe-url-pipe';

@Component({
  selector: 'app-magazine-component',
  imports: [SafeUrlPipe],
  templateUrl: './magazine-component.html',
  styleUrl: './magazine-component.css'
})
export class MagazineComponent {
  magazineUrl = signal<string>('');

  constructor(private magazineService: MagazineService) {}

  ngOnInit() {
    this.magazineService.getMagazineUrl().subscribe({
      next: (response) => {
        this.magazineUrl.set(response.url);
      },
      error: (err) => {
        console.error('Error fetching magazine URL:', err);
      }
    })
  }
}

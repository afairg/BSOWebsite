import { Component, signal } from '@angular/core';
import { SponsorService, Sponsor } from '../../services/sponsor';
import { SponsorComponent } from '../sponsor-component/sponsor-component';

@Component({
  selector: 'app-season-sponsors',
  imports: [SponsorComponent],
  templateUrl: './season-sponsors.html',
  styleUrl: './season-sponsors.css'
})
export class SeasonSponsors {
  sponsors = signal<Sponsor[]>([]);

  constructor(private sponsorService: SponsorService) {}

  ngOnInit() {
    this.sponsorService.getAllSeasonSponsors().subscribe({
      next: (data: Sponsor[]) => {
        this.sponsors.set(data);
      },
      error: (error) => {
        console.error('Error fetching sponsors:', error);
      }
    });
  }
}

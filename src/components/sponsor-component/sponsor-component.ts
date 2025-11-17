import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sponsor-component',
  imports: [],
  templateUrl: './sponsor-component.html',
  styleUrl: './sponsor-component.css'
})
export class SponsorComponent {
  public name = input<string>('');
  public imageUrl = input<string>('');
  public sortid = input<number | null>(null);
}

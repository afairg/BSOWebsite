import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-component',
  imports: [DatePipe],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  public isHero = input<boolean>(false);
  public type = input<string>('');
  public title = input<string>('');
  public description = input<string>('');
  public location = input<string>('');
  public date = input<string>('');
  public imageUrl = input<string>('');

  constructor(private router: Router) {}

  navigateToDetail(title: string) {
    this.router.navigate(['/events', title]);
  }
}

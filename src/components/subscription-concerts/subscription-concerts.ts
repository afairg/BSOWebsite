import { Component, signal } from '@angular/core';
import { Event, EventService } from '../../services/event';
import { EventComponent } from '../event-component/event-component';

@Component({
  selector: 'app-subscription-concerts',
  imports: [EventComponent],
  templateUrl: './subscription-concerts.html',
  styleUrl: './subscription-concerts.css'
})
export class SubscriptionConcerts {
  events = signal<Event[]>([]);
  
  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getSubscriptionEvents().subscribe({
      next: (data: Event[]) => {
        this.events.set(data);
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching subscription events:', error);
      }
    })
  }
}

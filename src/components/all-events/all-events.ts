import { Component, signal } from '@angular/core';
import { Event, EventService } from '../../services/event';
import { EventComponent } from '../event-component/event-component';

@Component({
  selector: 'app-all-events',
  imports: [EventComponent],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents {
  events = signal<Event[]>([]);
  
  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events.set(data);
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching all events:', error);
      }
    })
  }
}

import { Component, signal } from '@angular/core';
import { Event, EventService } from '../../services/event';
import { EventComponent } from '../event-component/event-component';

@Component({
  selector: 'app-education',
  imports: [EventComponent],
  templateUrl: './education.html',
  styleUrl: './education.css'
})
export class Education {
  events = signal<Event[]>([]);
  
  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEducationEvents().subscribe({
      next: (data: Event[]) => {
        this.events.set(data);
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching education events:', error);
      }
    })
  }
}

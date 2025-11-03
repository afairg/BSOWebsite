import { Component, computed, signal } from '@angular/core';
import { EventComponent } from "../../components/event-component/event-component";
import { EventService, Event } from '../../services/event';

@Component({
  selector: 'app-home',
  imports: [EventComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  events = signal<Event[]>([]);
  heroEvent = signal<Event | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  upcomingEvents = computed(() => {
    const allEvents = this.events();
    return allEvents.length > 1 ? allEvents.slice(1, 4) : [];
  });

  message = '';

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log('Events fetched:', data);
        this.events.set(data);
        this.heroEvent.set(data.length > 0 ? data[0] : null);
        console.log(this.heroEvent());
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load events');
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}

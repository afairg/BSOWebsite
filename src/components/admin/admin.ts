import { Component, computed, signal } from '@angular/core';
import { EventService, Event } from '../../services/event';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  error = signal<string | null>(null);
  events = signal<Event[]>([]);
  currentPage = signal(1); // Current page number
  pageSize = signal(5); // Number of items per page

  // Computed signal for paginated events
  paginatedEvents = computed(() => {
    const allEvents = this.events();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return allEvents.slice(startIndex, startIndex + size);
  });

  // Computed signal for total pages
  totalPages = computed(() => {
    const totalEvents = this.events().length;
    const size = this.pageSize();
    return Math.ceil(totalEvents / size);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  })

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        console.log('Events fetched:', data);
        this.events.set(data);
      },
      error: (err) => {
        this.error.set('Failed to load events');
        console.error(err);
      }
    });
  }

  // Method to change the current page
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }
}

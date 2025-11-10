import { Component, computed, signal } from '@angular/core';
import { EventService, Event } from '../../services/event';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  error = signal<string | null>(null);
  events = signal<Event[]>([]);
  currentPage = signal(1); // Current page number
  pageSize = signal(5); // Number of items per page
  selectedFile!: File;
  newEvent = {
    title: '',
    type: '',
    description: '',
    date: '',
    location: '',
    imageurl: ''
  };
  selectedEvent = {
    title: '',
    type: '',
    description: '',
    date: '',
    location: '',
    imageurl: ''
  }

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

  constructor(private http: HttpClient, private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events.set(data);
      },
      error: (err) => {
        console.error('Failed to load events:', err);
      }
    });
  }

  addEvent() {
    // Validate the input fields
    if (!this.newEvent.title || !this.newEvent.type || !this.newEvent.date || !this.newEvent.description || !this.newEvent.location) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.selectedFile) {
    // Upload image first
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.eventService.uploadImage(formData).subscribe({
      next: (response: any) => {
        this.newEvent.imageurl = response.url; // ✅ Now we have the real URL
        console.log('Image uploaded:', response.url);

        // ✅ Only add the event AFTER the image upload succeeds
        this.sendAddEventRequest();
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed. Please try again.');
      }
    });
  } else {
    // If no image, just add the event
    this.sendAddEventRequest();
  }
  }

  deleteEvent(eventTitle: string) {
    if (confirm(`Are you sure you want to delete the event: ${eventTitle}?`)) {
      this.eventService.deleteEvent(eventTitle).subscribe({
        next: () => {
          alert(`Event "${eventTitle}" deleted successfully.`);
          this.loadEvents();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  editEvent(event: Event) {
    this.selectedEvent = { ...event };
  }

  updateEvent() {
    if (!this.selectedEvent.title || !this.selectedEvent.type || !this.selectedEvent.date || !this.selectedEvent.description || !this.selectedEvent.location) {
      alert('Please fill in all fields.');
      return;
    }
    this.eventService.updateEvent(this.selectedEvent).subscribe({
      next: () => {
        alert(`Event "${this.selectedEvent.title}" updated successfully.`);
        this.loadEvents();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update event. Please try again.');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    this.eventService.uploadImage(formData).subscribe({
      next: (response: any) => {
        this.newEvent.imageurl = response.url;
        console.log('Image uploaded:', response.url);
      },
      error: (err) => {
        console.error('Image upload failed:', err);
      }
    });
  }

  sendAddEventRequest() {
  this.eventService.addEvent(this.newEvent).subscribe({
    next: (response: any) => {
      alert(response.message || 'Event added successfully!');
      this.loadEvents();
    },
    error: (err) => {
      console.error('Failed to add event:', err);
      alert('Failed to add event. Please try again.');
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

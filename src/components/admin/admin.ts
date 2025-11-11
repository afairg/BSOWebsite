import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { EventService, Event } from '../../services/event';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

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
    time: '',
    location: '',
    imageurl: ''
  };
  selectedEvent = {
    title: '',
    type: '',
    description: '',
    date: '',
    time: '',
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

  constructor(private eventService: EventService, public authService: Auth) {}

  @ViewChild('addEventModal') addEventModal!: ElementRef;

  ngOnInit() {
    this.loadEvents();
  }

  // Fetch all events from the server
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

  // Add a new event to the database
  addEvent() {
    // Validate the input fields
    if (!this.newEvent.title || !this.newEvent.type || !this.newEvent.date || !this.newEvent.description || !this.newEvent.location) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
      return;
    }

    if (this.selectedFile) {
    // Upload image first
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.eventService.uploadImage(formData).subscribe({
      next: (response: any) => {
        this.newEvent.imageurl = response.url;
        console.log('Image uploaded:', response.url);

        // Only add the event after the image upload succeeds
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

  // Delete an event by title
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

  // Prepare to edit an event
  editEvent(event: Event) {
    this.selectedEvent = { ...event };
  }

  // Update an existing event
  updateEvent() {
    const datetime = `${this.selectedEvent.date}T${this.selectedEvent.time}`;
    const event = { ...this.selectedEvent, date: datetime };
    if (!this.selectedEvent.title || !this.selectedEvent.type || !this.selectedEvent.date || !this.selectedEvent.description || !this.selectedEvent.location) {
      alert('Please fill in all fields.');
      return;
    }
    this.eventService.updateEvent(event).subscribe({
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

  // Logic for uploading an image to the server
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

  // Logic to send an add event request after image is uploaded
  sendAddEventRequest() {
    const datetime = `${this.newEvent.date}T${this.newEvent.time}`;
    const event = { ...this.newEvent, date: datetime };
    this.eventService.addEvent(event).subscribe({
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

  // Method to change the current page of the table
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }
}

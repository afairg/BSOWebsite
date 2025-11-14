import { Component, computed, signal } from '@angular/core';
import { EventService, Event } from '../../services/event';
import { PersonnelService, Personnel } from '../../services/personnel';
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
  personnel = signal<Personnel[]>([]);
  currentPage = signal(1); // Current page number
  pageSize = signal(5); // Number of items per page
  selectedFile!: File;
  newEvent: Event = {
    title: '',
    type: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageurl: ''
  };
  selectedEvent: Event = {
    title: '',
    type: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageurl: ''
  };
  newPersonnel: Personnel = {
    fullname: '',
    type: '',
    title: '',
    description: '',
    email: '',
    phone: null,
    imageurl: '',
    sortid: null
  };
  selectedPersonnel: Personnel = {
    fullname: '',
    type: '',
    title: '',
    description: '',
    email: '',
    phone: null,
    imageurl: '',
    sortid: null
  }

  // Computed signal for paginated events
  paginatedEvents = computed(() => {
    const allEvents = this.events();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return allEvents.slice(startIndex, startIndex + size);
  });

  paginatedPersonnel = computed(() => {
    const allPersonnel = this.personnel();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return allPersonnel.slice(startIndex, startIndex + size);
  });

  totalPersonnelPages = computed(() => {
    const totalPersonnel = this.personnel().length;
    const size = this.pageSize();
    return Math.ceil(totalPersonnel / size);
  })

  // Computed signal for total pages
  totalEventsPages = computed(() => {
    const totalEvents = this.events().length;
    const size = this.pageSize();
    return Math.ceil(totalEvents / size);
  });

  personnelPageNumbers = computed(() => {
    const total = this.totalPersonnelPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  })

  eventsPageNumbers = computed(() => {
    const total = this.totalEventsPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  })

  constructor(private eventService: EventService, public authService: Auth, private personnelService: PersonnelService) {}

  ngOnInit() {
    this.loadEvents();
    this.loadPersonnel();
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

  loadPersonnel() {
    this.personnelService.getAllPersonnel().subscribe({
      next: (data: Personnel[]) => {
        this.personnel.set(data);
        console.log('personnel set:', data);
      },
      error: (err) => {
        console.error('Failed to load personnel');
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

  addPersonnel() {
    console.log(this.newPersonnel);
    // Validate the input fields
    if (!this.newPersonnel.fullname || !this.newPersonnel.type || !this.newPersonnel.title || !this.newPersonnel.sortid) {
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

      this.personnelService.uploadImage(formData).subscribe({
        next: (response: any) => {
          this.newPersonnel.imageurl = response.url;
          console.log('Image uploaded:', response.url);

          // Only add the person after the image upload succeeds
          this.sendAddPersonnelRequest();
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          alert('Image upload failed. Please try again.');
        }
      });
    } else {
      // If no image, just add the person
      this.sendAddPersonnelRequest();
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

  // Delete a person by name
  deletePersonnel(fullName: string) {
    if (confirm(`Are you sure you want to delete this person: ${fullName}?`)) {
      this.personnelService.deletePersonnel(fullName).subscribe({
        next: () => {
          alert(`Event "${fullName}" deleted successfully.`);
          this.loadPersonnel();
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

  // Prepare to edit a person
  editPersonnel(person: Personnel) {
    this.selectedPersonnel = { ...person };
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

  updatePersonnel() {
    const person = { ...this.selectedPersonnel };
    if (!this.selectedPersonnel.fullname || !this.selectedPersonnel.type || !this.selectedPersonnel.title ) {
      Swal.fire({
        title:  'Error!',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
      return;
    }
    this.personnelService.updatePersonnel(person).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: `${this.selectedPersonnel.fullname} updated successfully.`,
          icon: 'success',
          timer: 2000
        });
        this.loadPersonnel();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update person. Please try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
      }
    });
  }

  onFileSelected(event: any) {
    console.log(event.target.files)
    this.selectedFile = event.target.files[0];
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

  sendAddPersonnelRequest() {
    const person = { ...this.newPersonnel };
    this.personnelService.addPersonnel(person).subscribe({
      next: (response: any) => {
        alert(response.message || 'Person added successfully!');
        this.loadPersonnel();
      },
      error: (err) => {
        console.error('Failed to add person:', err);
        alert('Failed to add person. Please try again.');
      }
    })
  }

  // Method to change the current page of the table
  changeEventPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalEventsPages()) {
      this.currentPage.set(newPage);
    }
  }

  changePersonnelPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPersonnelPages()) {
      this.currentPage.set(newPage);
    }
  }

  resetCurrentPage() {
    this.currentPage.set(1);
  }
}

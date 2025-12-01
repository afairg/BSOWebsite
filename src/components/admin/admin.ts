import { Component, computed, signal } from '@angular/core';
import { EventService, Event } from '../../services/event';
import { PersonnelService, Personnel } from '../../services/personnel';
import { SponsorService, Sponsor } from '../../services/sponsor';
import { MagazineService, Magazine } from '../../services/magazine';
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
  sponsors = signal<Sponsor[]>([]);
  currentPage = signal(1); // Current page number
  pageSize = signal(5); // Number of items per page
  selectedFile!: File;
  newEvent: Event = {
    title: '',
    type: '',
    description: '',
    detailed_description: '',
    date: '',
    time: '',
    location: '',
    imageurl: '',
    general_ticket_price: 0,
    senior_ticket_price: 0,
    venue_link: ''
  };
  selectedEvent: Event = {
    title: '',
    type: '',
    description: '',
    detailed_description: '',
    date: '',
    time: '',
    location: '',
    imageurl: '',
    general_ticket_price: 0,
    senior_ticket_price: 0,
    venue_link: ''
  };
  newPersonnel: Personnel = {
    fullname: '',
    type: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    imageurl: '',
    sortid: null
  };
  selectedPersonnel: Personnel = {
    fullname: '',
    type: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    imageurl: '',
    sortid: null
  };
  newSponsor: Sponsor = {
    name: '',
    imageurl: '',
    sortid: null
  };
  selectedSponsor: Sponsor = {
    name: '',
    imageurl: '',
    sortid: null
  };
  seasonMagazineFile: Magazine = {
    file_url: ''
  };

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

  paginatedSponsors = computed(() => {
    const allSponsors = this.sponsors();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return allSponsors.slice(startIndex, startIndex + size);
  });

  // Computed signal for total pages
  totalPersonnelPages = computed(() => {
    const totalPersonnel = this.personnel().length;
    const size = this.pageSize();
    return Math.ceil(totalPersonnel / size);
  })

  totalEventsPages = computed(() => {
    const totalEvents = this.events().length;
    const size = this.pageSize();
    return Math.ceil(totalEvents / size);
  });

  totalSponsorsPages = computed(() => {
    const totalSponsors = this.sponsors().length;
    const size = this.pageSize();
    return Math.ceil(totalSponsors / size);
  });

  // computed signal for page numbers
  personnelPageNumbers = computed(() => {
    const total = this.totalPersonnelPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  eventsPageNumbers = computed(() => {
    const total = this.totalEventsPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  sponsorsPageNumbers = computed(() => {
    const total = this.totalSponsorsPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  })

  constructor(private eventService: EventService, public authService: Auth, private personnelService: PersonnelService, private sponsorService: SponsorService, private magazineService: MagazineService) {}

  ngOnInit() {
    this.loadEvents();
    this.loadPersonnel();
    this.loadSponsors();
  }

  onSeasonMagazineSelected(event: any) {
    const file = event.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid PDF file for the season magazine.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file);

    this.eventService.uploadImage(formData).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Season magazine uploaded successfully.',
          icon: 'success',
          timer: 2000
        });
        console.log('Season magazine uploaded:', response.url);
        this.seasonMagazineFile.file_url = response.url;
        this.magazineService.addMagazineUrl(this.seasonMagazineFile).subscribe({
          next: (nestedResponse: any) => {
            console.log('Season magazine URL added to database:', nestedResponse);
          },
          error: (err) => {
            console.error('Failed to add season magazine URL to database:', err);
          }
        })
      },
      error: (err) => {
        console.error('Season magazine upload failed:', err);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Season magazine upload failed. Please try again.',
          confirmButtonText: 'Close'
        });
      }
    });
  }

  // Fetch all database items from the server
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

  loadSponsors() {
    this.sponsorService.getAllSeasonSponsors().subscribe({
      next: (data: Sponsor[]) => {
        this.sponsors.set(data);
        console.log('sponsors set:', data);
      },
      error: (err) => {
        console.error('Failed to load sponsors');
      }
    });
  }

  // Add a new item to the database
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
      formData.append('file', this.selectedFile);

      this.eventService.uploadImage(formData).subscribe({
        next: (response: any) => {
          this.newEvent.imageurl = response.url;
          // Only add the event after the image upload succeeds
          this.sendAddEventRequest();
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          Swal.fire({
            title: 'Error!',
            icon: 'error',
            text: 'Image upload failed. Please try again.',
            confirmButtonText: 'Close'
          });
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
      formData.append('file', this.selectedFile);

      this.personnelService.uploadImage(formData).subscribe({
        next: (response: any) => {
          this.newPersonnel.imageurl = response.url;
          console.log('Image uploaded:', response.url);

          // Only add the person after the image upload succeeds
          this.sendAddPersonnelRequest();
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          Swal.fire({
            title: 'Error!',
            icon: 'error',
            text: 'Image upload failed. Please try again.',
            confirmButtonText: 'Close'
          });
        }
      });
    } else {
      // If no image, just add the person
      this.sendAddPersonnelRequest();
    }
  }

  addSponsor() {
    // Validate the input fields
    if (!this.newSponsor.name || !this.newSponsor.sortid) {
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
      formData.append('file', this.selectedFile);

      this.sponsorService.uploadImage(formData).subscribe({
        next: (response: any) => {
          this.newSponsor.imageurl = response.url;
          console.log('Image uploaded:', response.url);

          // Only add the event after the image upload succeeds
          this.sendAddSponsorRequest();
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          Swal.fire({
            title: 'Error!',
            icon: 'error',
            text: 'Image upload failed. Please try again.',
            confirmButtonText: 'Close'
          });
        }
      });
    } else {
      // If no image, just add the event
      this.sendAddSponsorRequest();
    }
  }

  // Delete an item by title
  deleteEvent(eventTitle: string) {
    if (confirm(`Are you sure you want to delete the event: ${eventTitle}?`)) {
      this.eventService.deleteEvent(eventTitle).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: `Event "${eventTitle}" deleted successfully`,
            timer: 2000
          })
          this.loadEvents();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  deletePersonnel(fullName: string) {
    if (confirm(`Are you sure you want to delete this person: ${fullName}?`)) {
      this.personnelService.deletePersonnel(fullName).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: `Person "${fullName}" deleted successfully.`,
            timer: 2000
          })
          this.loadPersonnel();
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  deleteSponsor(name: string) {
    if (confirm(`Are you sure you want to delete the event: ${name}?`)) {
      this.sponsorService.deleteSeasonSponsor(name).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: `Sponsor "${name}" deleted successfully.`,
            timer: 2000
          });
          this.loadSponsors();
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

  // Prepare to edit a sponsor
  editSponsor(sponsor: Sponsor) {
    this.selectedSponsor = { ...sponsor };
  }

  // Update an existing item
  updateEvent() {
    const datetime = `${this.selectedEvent.date}T${this.selectedEvent.time}`;
    const event = { ...this.selectedEvent, date: datetime };
    if (!this.selectedEvent.title || !this.selectedEvent.type || !this.selectedEvent.date || !this.selectedEvent.description || !this.selectedEvent.location) {
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'Please fill in all fields.',
        confirmButtonText: 'Close'
      })
      return;
    }
    this.eventService.updateEvent(event).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: `${this.selectedEvent.title} updated successfully.`,
          timer: 2000
        })
        this.loadEvents();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Failed to update event. Please try again.',
          confirmButtonText: 'Close'
        })
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

  updateSponsor() {
    const sponsor = { ...this.selectedSponsor };
    if (!this.selectedSponsor.name || !this.selectedSponsor.sortid ) {
      Swal.fire({
        title:  'Error!',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
      return;
    }
    this.sponsorService.updateSeasonSponsor(sponsor).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: `${this.selectedSponsor.name} updated successfully.`,
          icon: 'success',
          timer: 2000
        });
        this.loadSponsors();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update sponsor. Please try again.',
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

  // Logic to send an add item request after image is uploaded
  sendAddEventRequest() {
    const datetime = `${this.newEvent.date}T${this.newEvent.time}`;
    const event = { ...this.newEvent, date: datetime };
    this.eventService.addEvent(event).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Event added successfully.',
          timer: 2000
        });
        this.loadEvents();
      },
      error: (err) => {
        console.error('Failed to add event:', err);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Failed to add event. Please try again.',
          confirmButtonText: 'Close'
        });
      }
    });
  }

  sendAddPersonnelRequest() {
    const person = { ...this.newPersonnel };
    this.personnelService.addPersonnel(person).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Person added successfully!',
          timer: 2000
        });
        this.loadPersonnel();
      },
      error: (err) => {
        console.error('Failed to add person:', err);
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Failed to add person. Please try again.',
          confirmButtonText: 'Close'
        });
      }
    });
  }

  sendAddSponsorRequest() {
    const sponsor = { ...this.newSponsor };
    this.sponsorService.addSeasonSponsor(sponsor).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'Event added successfully!',
          timer: 2000
        });
        this.loadSponsors();
      },
      error: (err) => {
        console.error('Failed to add sponsor:', err);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Failed to add sponsor. Please try again.',
          confirmButtonText: 'Close'
        });
      }
    });
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

  changeSponsorPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalSponsorsPages()) {
      this.currentPage.set(newPage);
    }
  }

  resetCurrentPage() {
    this.currentPage.set(1);
  }
}

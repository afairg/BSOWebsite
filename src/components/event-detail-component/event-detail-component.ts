import { Component, signal } from '@angular/core';
import { Event, EventService } from '../../services/event';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-event-detail-component',
  imports: [DatePipe, DecimalPipe, FormsModule],
  templateUrl: './event-detail-component.html',
  styleUrl: './event-detail-component.css'
})
export class EventDetailComponent {
  event = signal<Event>({
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
  })

  constructor (private eventService: EventService) {}

  numbers: number[] = Array.from({ length: 51 }, (_, i) => i);

  numGeneralTickets = signal<number>(0);

  numSeniorTickets = signal<number>(0);



  ngOnInit() {
    // Decode the url to retrieve the event name
    const pathname = window.location.href;
    const segments = pathname.split('/');
    const lastSegment = segments.pop() || '';
    const eventTitle = decodeURIComponent(lastSegment);

    this.eventService.getEventByTitle(eventTitle).subscribe({
      next: (data: Event) => {
        this.event.set(data);
        console.log(this.event());
      }
    })
  }

  get totalPrice() {
    return (this.numGeneralTickets() * this.event().general_ticket_price) + (this.numSeniorTickets() * this.event().senior_ticket_price);
  }
}

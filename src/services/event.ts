import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageurl: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private allEventsUrl = 'https://bso.swollenhippo.com/backend/api/events';
  private imageUploadUrl = 'https://bso.swollenhippo.com/backend/api/upload-image';


  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.allEventsUrl);
  }

  getSubscriptionEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('https://bso.swollenhippo.com/backend/api/subscription-events');
  }

  getEducationEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('https://bso.swollenhippo.com/backend/api/education-events');
  }

  addEvent(event: Event): Observable<any> {
    return this.http.post<any>(this.allEventsUrl, event)
  }

  uploadImage(formData: FormData): Observable<any> {
    console.log(formData);
    return this.http.post<{ url: string }>(this.imageUploadUrl, formData);
  }

  deleteEvent(eventTitle: string): Observable<any> {
    return this.http.delete(`https://bso.swollenhippo.com/backend/api/events?title=${encodeURIComponent(eventTitle)}`);
  }

  updateEvent(event: Event): Observable<any> {
    return this.http.put<any>(this.allEventsUrl, event);
  }
}

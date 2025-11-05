import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  imageurl: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://bso.swollenhippo.com/backend/server.php';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Sponsor {
  name: string,
  imageurl: string,
  sortid: number | null
}
@Injectable({
  providedIn: 'root'
})
export class SponsorService {
  constructor(private http: HttpClient) {}

  getAllSeasonSponsors() {
    return this.http.get<Sponsor[]>('https://bso.swollenhippo.com/backend/api/season-sponsors');
  }

  addSeasonSponsor(sponsor: Sponsor) {
    return this.http.post<any>('https://bso.swollenhippo.com/backend/api/season-sponsors', sponsor);
  }

  deleteSeasonSponsor(name: string) {
    return this.http.delete(`https://bso.swollenhippo.com/backend/api/season-sponsors?name=${encodeURIComponent(name)}`);
  }

  updateSeasonSponsor(sponsor: Sponsor): Observable<any> {
    console.log('sponsor', sponsor);
    return this.http.put<any>('https://bso.swollenhippo.com/backend/api/season-sponsors', sponsor);
  }

  uploadImage(formData: FormData): Observable<any> {
    console.log(formData);
    return this.http.post<{ url: string }>('https://bso.swollenhippo.com/backend/api/upload-image', formData);
  }
}

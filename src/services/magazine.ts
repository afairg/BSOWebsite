import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Magazine {
  file_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class MagazineService {
  constructor(private http: HttpClient) {}

  uploadMagazine(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>('https://bso.swollenhippo.com/backend/api/upload-image', formData);
  }

  getMagazineUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>('https://bso.swollenhippo.com/backend/api/get-magazine');
  }

  addMagazineUrl(fileUrl: Magazine): Observable<any> {
    return this.http.post<any>('https://bso.swollenhippo.com/backend/api/add-magazine', fileUrl);
  }
}

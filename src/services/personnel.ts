import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personnel {
  fullname: string;
  type: string;
  title: string;
  description: string;
  email: string;
  phone: number | null;
  imageurl: string;
  sortid: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  constructor (private http: HttpClient) {}

  getAllPersonnel() {
    return this.http.get<Personnel[]>('https://bso.swollenhippo.com/backend/api/personnel');
  }

  getStaffPersonnel() {
    return this.http.get<Personnel[]>('https://bso.swollenhippo.com/backend/api/personnel/staff');
  }

  getBoardOfDirectors() {
    return this.http.get<Personnel[]>('https://bso.swollenhippo.com/backend/api/personnel/board-of-directors');
  }

  getMusicDirector() {
    return this.http.get<Personnel[]>('https://bso.swollenhippo.com/backend/api/personnel/music-director');
  }

  getSortIds() {
    return this.http.get<any>('https://bso.swollenhippo.com/backend/api/personnel/sortid');
  }

  addPersonnel(person: Personnel): Observable<any> {
    return this.http.post<any>('https://bso.swollenhippo.com/backend/api/personnel', person);
  }

  deletePersonnel(fullName: string): Observable<any> {
    return this.http.delete(`https://bso.swollenhippo.com/backend/api/personnel?fullname=${encodeURIComponent(fullName)}`);
  }

  updatePersonnel(person: Personnel): Observable<any> {
    return this.http.put<any>('https://bso.swollenhippo.com/backend/api/personnel', person);
  }

  uploadImage(formData: FormData): Observable<any> {
    console.log(formData);
    return this.http.post<{ url: string }>('https://bso.swollenhippo.com/backend/api/upload-image', formData);
  }
}

import { Component, signal } from '@angular/core';
import { PersonnelService, Personnel } from '../../services/personnel';
import { PersonComponent } from '../person-component/person-component';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-music-director',
  imports: [PersonComponent],
  templateUrl: './music-director.html',
  styleUrl: './music-director.css'
})
export class MusicDirector {
  people = signal<Personnel[]>([]);
  admin = signal<boolean>(false);

  constructor (private personnelService: PersonnelService, private authService: Auth) {}

  ngOnInit() {
    this.personnelService.getMusicDirector().subscribe({
      next: (data: Personnel[]) => {
        this.people.set(data);
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching all personnel:', error);
      }
    });
    if (this.authService.isAdmin()) {
      this.admin.set(true);
    }
  }
}

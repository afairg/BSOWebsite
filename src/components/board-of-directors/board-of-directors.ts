import { Component, signal } from '@angular/core';
import { PersonnelService, Personnel } from '../../services/personnel';
import { PersonComponent } from '../person-component/person-component';

@Component({
  selector: 'app-board-of-directors',
  imports: [PersonComponent],
  templateUrl: './board-of-directors.html',
  styleUrl: './board-of-directors.css'
})
export class BoardOfDirectors {
  people = signal<Personnel[]>([]);

  constructor (private personnelService: PersonnelService) {}

  ngOnInit() {
    this.personnelService.getBoardOfDirectors().subscribe({
          next: (data: Personnel[]) => {
            this.people.set(data);
            console.log(data);
          },
          error: (error) => {
            console.error('Error fetching all personnel:', error);
          }
        })
  }
}

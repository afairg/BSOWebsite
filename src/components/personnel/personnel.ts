import { Component, signal } from '@angular/core';
import { PersonnelService, Personnel } from '../../services/personnel';
import { PersonComponent } from '../person-component/person-component';

@Component({
  selector: 'app-personnel',
  imports: [PersonComponent],
  templateUrl: './personnel.html',
  styleUrl: './personnel.css'
})
export class PersonnelPage {
  people = signal<Personnel[]>([]);

  constructor (private personnelService: PersonnelService) {}

  ngOnInit() {
    this.personnelService.getStaffPersonnel().subscribe({
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

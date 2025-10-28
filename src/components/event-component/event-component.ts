import { Component, input } from '@angular/core';

@Component({
  selector: 'app-event-component',
  imports: [],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  public hero = input<boolean>(false);
  public title = input<string>('');
  public description = input<string>('');
  public location = input<string>('');
  public date = input<string>('');
  public imageUrl = input<string>('');
}

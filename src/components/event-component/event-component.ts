import { Component, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-component',
  imports: [DatePipe],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  public isHero = input<boolean>(false);
  public type = input<string>('');
  public title = input<string>('');
  public description = input<string>('');
  public location = input<string>('');
  public date = input<string>('');
  public imageUrl = input<string>('');

  ngOnInit() {
    console.log('imageUrl:', this.imageUrl());
    console.log('title', this.title());
    console.log('type', this.type());
  }
}

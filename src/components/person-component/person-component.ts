import { Component, input } from '@angular/core';

@Component({
  selector: 'app-person-component',
  imports: [],
  templateUrl: './person-component.html',
  styleUrl: './person-component.css'
})
export class PersonComponent {
  public isHero = input<boolean>(false);
  public fullName = input<string>('');
  public type = input<string>('');
  public title = input<string>('');
  public description = input<string>('');
  public email = input<string>('');
  public phone = input<number | null>(null);
  public imageUrl = input<string>('');
  public sortId = input<number>(100);
}

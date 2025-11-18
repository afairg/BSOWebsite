import { Component, input } from '@angular/core';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

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
  public phone = input<string>('');
  public imageUrl = input<string>('');
  public sortId = input<number>(100);

  phoneUtil = PhoneNumberUtil.getInstance();
  strPhone = this.phone()?.toString();

  formatPhone(raw: string | null | undefined): string {
    if (!raw) return '';

    try {
      const parsed = this.phoneUtil.parseAndKeepRawInput(raw, 'US');
      return this.phoneUtil.format(parsed, PhoneNumberFormat.NATIONAL);
    } catch (e) {
      console.warn('Phone format error:', e);
      return raw;
    }
  }
}

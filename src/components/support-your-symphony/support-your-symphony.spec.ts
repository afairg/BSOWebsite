import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportYourSymphony } from './support-your-symphony';

describe('SupportYourSymphony', () => {
  let component: SupportYourSymphony;
  let fixture: ComponentFixture<SupportYourSymphony>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportYourSymphony]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportYourSymphony);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

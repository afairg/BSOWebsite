import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertHall } from './concert-hall';

describe('ConcertHall', () => {
  let component: ConcertHall;
  let fixture: ComponentFixture<ConcertHall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcertHall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertHall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

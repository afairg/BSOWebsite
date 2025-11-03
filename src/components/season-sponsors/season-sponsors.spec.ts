import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonSponsors } from './season-sponsors';

describe('SeasonSponsors', () => {
  let component: SeasonSponsors;
  let fixture: ComponentFixture<SeasonSponsors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonSponsors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonSponsors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerOpportunities } from './career-opportunities';

describe('CareerOpportunities', () => {
  let component: CareerOpportunities;
  let fixture: ComponentFixture<CareerOpportunities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerOpportunities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerOpportunities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

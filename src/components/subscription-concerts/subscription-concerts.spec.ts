import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionConcerts } from './subscription-concerts';

describe('SubscriptionConcerts', () => {
  let component: SubscriptionConcerts;
  let fixture: ComponentFixture<SubscriptionConcerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionConcerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionConcerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

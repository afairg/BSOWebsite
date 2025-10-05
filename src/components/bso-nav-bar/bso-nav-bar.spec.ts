import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsoNavBar } from './bso-nav-bar';

describe('BsoNavBar', () => {
  let component: BsoNavBar;
  let fixture: ComponentFixture<BsoNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BsoNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsoNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

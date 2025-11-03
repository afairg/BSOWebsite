import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcomerGuide } from './newcomer-guide';

describe('NewcomerGuide', () => {
  let component: NewcomerGuide;
  let fixture: ComponentFixture<NewcomerGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewcomerGuide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewcomerGuide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

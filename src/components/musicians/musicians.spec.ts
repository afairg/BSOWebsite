import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Musicians } from './musicians';

describe('Musicians', () => {
  let component: Musicians;
  let fixture: ComponentFixture<Musicians>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Musicians]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Musicians);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

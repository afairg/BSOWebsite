import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAndMission } from './history-and-mission';

describe('HistoryAndMission', () => {
  let component: HistoryAndMission;
  let fixture: ComponentFixture<HistoryAndMission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryAndMission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryAndMission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicDirector } from './music-director';

describe('MusicDirector', () => {
  let component: MusicDirector;
  let fixture: ComponentFixture<MusicDirector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicDirector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicDirector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOfDirectors } from './board-of-directors';

describe('BoardOfDirectors', () => {
  let component: BoardOfDirectors;
  let fixture: ComponentFixture<BoardOfDirectors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardOfDirectors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardOfDirectors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

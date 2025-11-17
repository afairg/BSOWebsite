import { TestBed } from '@angular/core/testing';

import { Sponsor } from './sponsor';

describe('Sponsor', () => {
  let service: Sponsor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sponsor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

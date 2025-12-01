import { TestBed } from '@angular/core/testing';

import { Magazine } from './magazine';

describe('Magazine', () => {
  let service: Magazine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Magazine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AlmoxarifeService } from './almoxarife.service';

describe('AlmoxarifeService', () => {
  let service: AlmoxarifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlmoxarifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

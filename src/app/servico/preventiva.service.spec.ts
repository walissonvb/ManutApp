import { TestBed } from '@angular/core/testing';

import { PreventivaService } from './preventiva.service';

describe('PreventivaService', () => {
  let service: PreventivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreventivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MaquinaeService } from './maquinae.service';

describe('MaquinaeService', () => {
  let service: MaquinaeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaquinaeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

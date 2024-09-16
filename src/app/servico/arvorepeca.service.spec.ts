import { TestBed } from '@angular/core/testing';

import { ArvorepecaService } from './arvorepeca.service';

describe('ArvorepecaService', () => {
  let service: ArvorepecaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArvorepecaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

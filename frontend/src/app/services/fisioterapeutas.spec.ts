import { TestBed } from '@angular/core/testing';

import { Fisioterapeutas } from './fisioterapeutas';

describe('Fisioterapeutas', () => {
  let service: Fisioterapeutas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fisioterapeutas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

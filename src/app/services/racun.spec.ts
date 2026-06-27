import { TestBed } from '@angular/core/testing';
import { RacunService } from './racun';

describe('RacunService', () => {
  let service: RacunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RacunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GestionBookService } from './gestion-book.service';

describe('GestionBookService', () => {
  let service: GestionBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

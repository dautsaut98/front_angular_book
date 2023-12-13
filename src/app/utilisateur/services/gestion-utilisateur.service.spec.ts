import { TestBed } from '@angular/core/testing';

import { GestionUtilisateurService } from './gestion-utilisateur.service';

describe('GestionUtilisateurService', () => {
  let service: GestionUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

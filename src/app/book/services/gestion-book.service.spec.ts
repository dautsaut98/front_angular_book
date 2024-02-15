import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Utilisateur } from 'src/app/models/utilisateur';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';
import { GestionBookService } from './gestion-book.service';

describe('GestionBookService', () => {
  let service: GestionBookService;
  let mockGestionUtilisateurService: any;
  let httpTestingController: any;

  const urlBook = 'http://localhost:8080/book';

  beforeEach(() => {
    mockGestionUtilisateurService = jasmine.createSpyObj(['utilisateurSubject']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GestionBookService,
        { provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GestionBookService);
  });

  describe('addBook de GestionBookService', () => {
    it('appel de addBook renvoie une erreur', () => {
      // GIVEN
      const error = new HttpErrorResponse({
        error: new ErrorEvent('error', { message: 'Erreur interne du serveur' }),
        status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
        statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
      });
      spyOn(console, 'error');

      const book: Book = { id: 0, nom: '', dateParution: '', description: '', idUser: 0, lu: false, nomAuteur: '', prenomAuteur: '' };

      // WHEN
      const resultat = service.addBook(book);

      // THEN
      resultat.subscribe({
        error: errorReturn => expect(errorReturn).toEqual(jasmine.any(HttpErrorResponse))
      });
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('POST');
      // Simule la réponse à la requête HTTP attendue
      req.error(error);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
      expect(console.error).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
    });

    it('appel de addBook redirige', () => {
      // GIVEN
      const book: Book = { id: 0, nom: '', dateParution: '', description: '', idUser: 0, lu: false, nomAuteur: '', prenomAuteur: '' };

      // WHEN
      service.addBook(book).subscribe();

      // THEN
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('POST');
      // Simule la réponse à la requête HTTP attendue
      req.flush([null]);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
    });
  });

  describe('getBook de GestionBookService', () => {
    // Id de l'utilisateur utilise pour demander la liste des livres de celui-ci.
    const idUser = 0;

    beforeEach(() => {
      const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };
      mockGestionUtilisateurService.utilisateur$ = of(utilisateur);
    });

    it('appel de getBook renvoie une liste de 1 livre avec une corelation avec l id utilisateur', () => {
      // GIVEN  
      const book: Book = { id: 0, nom: '', dateParution: '', description: '', idUser: 1, lu: false, nomAuteur: '', prenomAuteur: '' };

      // WHEN
      let listeBook: Book[] = [];
      service.getBooks(idUser).subscribe((books: Book[]) => listeBook = books);

      // THEN
      expect(listeBook.length).toBe(0);
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(`/all/${urlBook}?idUser=${idUser}`);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('GET');
      // Simule la réponse à la requête HTTP attendue
      req.flush([book]);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
    });

    it('appel de getBook renvoie une erreur', () => {
      // GIVEN
      const expectedError = { status: 500, statusText: 'Erreur interne du serveur' };

      spyOn(console, 'error');

      // WHEN
      service.getBooks(idUser).subscribe({
        error: (errorReturn: HttpErrorResponse) => expect(errorReturn).toEqual(jasmine.objectContaining(expectedError)),
      });

      // THEN
      const req = httpTestingController.expectOne(`/all/${urlBook}?idUser=${idUser}`);
      expect(req.request.method).toBe('GET');
      req.flush(null, expectedError);
      httpTestingController.verify();

      expect(console.error).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
    });
  });
});
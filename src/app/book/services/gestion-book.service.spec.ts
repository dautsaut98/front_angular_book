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
  let mockGestionUtilisateurService : any;
  let mockRouter: any;
  let httpTestingController: any;

  const urlBook = 'http://localhost:4200/api/books';

  beforeEach(() => {
    mockGestionUtilisateurService = jasmine.createSpyObj(['utilisateurSubject']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GestionBookService,
        {provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService},
        {provide: Router, useValue: mockRouter}
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GestionBookService);
  });

  describe('addBook de GestionBookService', () => {
    xit('appel de addBook renvoie une erreur', () => {
      // GIVEN
      const error = new HttpErrorResponse({
        error: new ErrorEvent('error', {message: 'Erreur interne du serveur'}),
        status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
        statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
      });
      spyOn(console, 'error');

      const book: Book = {id: 0, nom: '', dateParution: '', description: '', idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};

      // WHEN
      service.addBook(book);

      // THEN
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
  
    xit('appel de addBook redirige', () => {
      // GIVEN
      const book: Book = {id: 0, nom: '', dateParution: '', description: '', idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};

      // WHEN
      service.addBook(book);

      // THEN
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('POST');
      // Simule la réponse à la requête HTTP attendue
      req.flush([null]);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
      expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/libraire']);
    });
  });

  describe('getBook de GestionBookService', () => {
    beforeEach(() => {
      const utilisateur: Utilisateur = {id: 1, email: 'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
      mockGestionUtilisateurService.utilisateur$ = of(utilisateur);
    });

    xit('appel de getBook renvoie une liste de 1 livre avec une corelation avec l id utilisateur', () => {
      // GIVEN  
      const book: Book = {id: 0, nom: '', dateParution: '', description: '', idUtilisateur: 1, lu: false, nomAuteur: '', prenomAuteur: ''};

      // WHEN
      const listeBook: Book[] = service.getBooks();

      // THEN
      expect(listeBook.length).toBe(0);
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('GET');
      // Simule la réponse à la requête HTTP attendue
      req.flush([book]);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
    });
  
    xit('appel de getBook renvoie une liste de 1 livre sans une corelation avec l id utilisateur', () => {
      // GIVEN
      const book: Book = {id: 0, nom: '', dateParution: '', description: '', idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};
  
      // WHEN
      const listeBook: Book[] = service.getBooks();
  
      // THEN
      expect(listeBook.length).toBe(0);
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('GET');
      // Simule la réponse à la requête HTTP attendue
      req.flush([book]);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();
    });
  
    xit('appel de getBook renvoie une erreur', () => {
      // GIVEN
      const error = new HttpErrorResponse({
        error: new ErrorEvent('error', {message: 'Erreur interne du serveur'}),
        status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
        statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
      });
  
      spyOn(console, 'error');
  
      // WHEN
      service.getBooks();
  
      // THEN
      // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
      const req = httpTestingController.expectOne(urlBook);
      // On vérifie que l'on est dans une méthode GET.
      expect(req.request.method).toBe('GET');
      // Simule la réponse à la requête HTTP attendue
      req.error(error);
      // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
      httpTestingController.verify();

       expect(console.error).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
    });
  });
});
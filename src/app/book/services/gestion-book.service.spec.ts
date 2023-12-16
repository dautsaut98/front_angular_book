import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Utilisateur } from 'src/app/models/utilisateur';
import { GestionBookService } from './gestion-book.service';

describe('addBook de GestionBookService', () => {
  let service: GestionBookService;
  let mockGestionUtilisateurService;
  let mockRouter: any;
  let mockHttpClient: any;

  beforeEach(() => {
    mockGestionUtilisateurService = jasmine.createSpyObj(['utilisateurSubject']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockHttpClient = jasmine.createSpyObj(['post', 'get']);

    service = new GestionBookService(mockGestionUtilisateurService, mockRouter, mockHttpClient);
  });

  it('appel de addBook renvoie une erreur', () => {
    // GIVEN
    let error = new Error('erreur');
    mockHttpClient.post.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    let book: Book = {id: 0, nom: '', dateParution: '', description: '', genre: [], idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};

    // WHEN
    service.addBook(book);

    // THEN
    expect(console.error).toHaveBeenCalledOnceWith(error);
  });

  it('appel de addBook redirige', () => {
    // GIVEN
    mockHttpClient.post.and.returnValue(of(null));
    let book: Book = {id: 0, nom: '', dateParution: '', description: '', genre: [], idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};

    // WHEN
    service.addBook(book);

    // THEN
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/libraire']);
  });
});

describe('getBook de GestionBookService', () => {
  let service: GestionBookService;
  let mockGestionUtilisateurService: any;
  let mockRouter: any;
  let mockHttpClient: any;

  beforeEach(() => {
    mockGestionUtilisateurService = {utilisateur$: new Observable<any>(null)};
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockHttpClient = jasmine.createSpyObj(['post', 'get']);

    service = new GestionBookService(mockGestionUtilisateurService, mockRouter, mockHttpClient);
  });

  it('appel de getBook renvoie une liste de 1 livre avec un corelation avec l id utilisateur', () => {
    // GIVEN
    const utilisateur: Utilisateur = {id: 1, email: 'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
    mockGestionUtilisateurService.utilisateur$ = of(utilisateur);

    const book: Book = {id: 0, nom: '', dateParution: '', description: '', genre: [], idUtilisateur: 1, lu: false, nomAuteur: '', prenomAuteur: ''};
    mockHttpClient.get.and.returnValue(of([book]));

    // WHEN
    const listeBook: Book[] = service.getBooks();

    // THEN
    expect(listeBook.length).toBe(1);
  });

  it('appel de getBook renvoie une liste de 1 livre sans un corelation avec l id utilisateur', () => {
    // GIVEN
    const utilisateur: Utilisateur = {id: 1, email: 'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
    mockGestionUtilisateurService.utilisateur$ = of(utilisateur);
    const book: Book = {id: 0, nom: '', dateParution: '', description: '', genre: [], idUtilisateur: 0, lu: false, nomAuteur: '', prenomAuteur: ''};
    mockHttpClient.get.and.returnValue(of([book]));

    // WHEN
    const listeBook: Book[] = service.getBooks();

    // THEN
    expect(listeBook.length).toBe(0);
  });

  it('appel de getBook renvoie une erreur', () => {
    // GIVEN
    const utilisateur: Utilisateur = {id: 1, email: 'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
    mockGestionUtilisateurService.utilisateur$ = of(utilisateur);

    const erreur = new Error('erreur');
    mockHttpClient.get.and.returnValue(throwError(() => erreur));

    spyOn(console, 'error');

    // WHEN
    service.getBooks();

    // THEN
    expect(console.error).toHaveBeenCalledOnceWith(erreur);
  });
});
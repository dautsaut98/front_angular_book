import { of, throwError } from "rxjs";
import { GestionUtilisateurService } from "./gestion-utilisateur.service";
import { Utilisateur } from "src/app/models/utilisateur";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpErrorResponse } from "@angular/common/http";

describe('GestionUtilisateurService', () => {
    let service: GestionUtilisateurService;
    let httpTestingController: any;
    const urlUtilisateur = "http://localhost:4200/api/utilisateurs";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GestionUtilisateurService]
        });
      
          httpTestingController = TestBed.inject(HttpTestingController);
          service = TestBed.inject(GestionUtilisateurService);
    });
    describe('getUtilisateurs de GestionUtilisateurService',() => {
    
        xit('getUtilisateurs with error', () => {
            // GIVEN
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', {message: 'Erreur interne du serveur'}),
                status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
                statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
              });
            spyOn(console, 'error');
    
            // WHEN
            const resultat = service.getUtilisateurs();
    
            // THEN
            resultat.subscribe({
                error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse))
            });
            // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
            const req = httpTestingController.expectOne(urlUtilisateur);
            // On vérifie que l'on est dans une méthode GET.
            expect(req.request.method).toBe('GET');
            // Simule la réponse à la requête HTTP attendue
            req.error(error);
            // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
            httpTestingController.verify();
        });
    
        xit('getUtilisateurs without error', () => {
            // GIVEN
            spyOn(console, 'info');
    
            // WHEN
            const resultat = service.getUtilisateurs();
    
            // THEN
            resultat.subscribe(() => expect(console.info).toHaveBeenCalled());
            // Vérifie si une requête correspondante a été effectuée avec l'URL attendue
            const req = httpTestingController.expectOne(urlUtilisateur);
            // On vérifie que l'on est dans une méthode GET.
            expect(req.request.method).toBe('GET');
            // Simule la réponse à la requête HTTP attendue
            req.flush(null);
            // Permet de vérifier que l'on remplie bien les conditions de httpTestingController.
            httpTestingController.verify();
        });
    });

    describe('connect de GestionUtilisateurService',() => {
        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        xit('connect without error and user find', () => {
            // WHEN
            const resultat = service.connect(utilisateur.login, utilisateur.password);

            // THEN
            resultat.subscribe((user) => expect(user).toEqual(utilisateur));
            const req = httpTestingController.expectOne(urlUtilisateur);
            expect(req.request.method).toBe('GET');
            req.flush([utilisateur]);
            httpTestingController.verify();
        });

        xit('connect without error and user not find', () => {
            // WHEN
            const resultat = service.connect(utilisateur.login, '');

            // THEN
            resultat.subscribe((user) => expect(user).toBeNull());
            const req = httpTestingController.expectOne(urlUtilisateur);
            expect(req.request.method).toBe('GET');
            req.flush([utilisateur]);
            httpTestingController.verify();
        });

        xit('connect with error', () => {
            // GIVEN
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', {message: 'Erreur interne du serveur'}),
                status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
                statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
            });
            spyOn(console, 'error');

            // WHEN
            const resultat = service.connect('testLogin', 'testPassword');

            // THEN
            resultat.subscribe({error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse))});
            const req = httpTestingController.expectOne(urlUtilisateur);
            expect(req.request.method).toBe('GET');
            req.error(error);
            httpTestingController.verify();
        });
    });
});

describe('disconnect de GestionUtilisateurService', () => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    xit('disconnect successful', () => {
        // GIVEN
        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        service.updateUtilisateurSubject(utilisateur);

        // WHEN
        service.disconnect();

        // THEN
        service.utilisateur$.subscribe((user) => expect(user).toEqual(null));
    });
});

describe('gestionErreurUtilisateur de GestionUtilisateurService',() => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    xit('gestionErreurUtilisateur with error', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        // WHEN
        service.gestionErreurUtilisateur(error);

        // THEN
        expect(console.error).toHaveBeenCalledOnceWith(error);
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });
});

describe('addUtilisateur de GestionUtilisateurService',() => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    xit('addUtilisateur with error', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.post.and.returnValue(throwError(() => error));

        // WHEN
        service.addUtilisateur(utilisateur);

        // THEN
        expect(console.error).toHaveBeenCalledOnceWith(error);
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });

    xit('addUtilisateur without error', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.post.and.returnValue(of(utilisateur));

        // WHEN
        service.addUtilisateur(utilisateur);

        // THEN
        service.utilisateur$.subscribe(utilisateurReturn => expect(utilisateurReturn).toEqual(utilisateur));
    });
});

describe('register de GestionUtilisateurService',() => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    xit('register with error in addUtilisateur', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        // Les 2 ont un login et email différent car sinon on tombe en erreur
        const utilisateurGet: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        const utilisateurPost: Utilisateur = {id:1, email:'test2@gmail.com', login:'testLogin2', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.post.and.returnValue(throwError(() => error));
        mockHttpClient.get.and.returnValue(of([utilisateurGet]));

        // WHEN
        service.register(utilisateurPost);

        // THEN
        expect(console.error).toHaveBeenCalledOnceWith(error);
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });

    xit('register without error', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        // Les 2 ont un login et email différent car sinon on tombe en erreur
        const utilisateurGet: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        const utilisateurPost: Utilisateur = {id:1, email:'test2@gmail.com', login:'testLogin2', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.post.and.returnValue(of(utilisateurPost));
        mockHttpClient.get.and.returnValue(of([utilisateurGet]));

        // WHEN
        service.register(utilisateurPost);

        // THEN
        service.utilisateur$.subscribe(utilisateurReturn => expect(utilisateurReturn).toEqual(utilisateurPost));
    });

    xit('register with error because email already exist', () => {
        // GIVEN
        const error = new Error('login ou password déjà existant')
        spyOn(console, 'error');

        // Les 2 ont un email commun pour tomber en erreur
        const utilisateurGet: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        const utilisateurPost: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin2', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.get.and.returnValue(of([utilisateurGet]));

        // WHEN
        service.register(utilisateurPost);

        // THEN
        expect(console.error).toHaveBeenCalledOnceWith(error);
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });

    xit('register with error in getUtilisateurs', () => {
        // GIVEN
        const error = new Error("error");
        spyOn(console, 'error');

        const utilisateurPost: Utilisateur = {id:1, email:'test2@gmail.com', login:'testLogin2', password:'testPassword', prenom:'testPrenom', nom:'testNom'};

        mockHttpClient.get.and.returnValue(throwError(() => error));

        // WHEN
        service.register(utilisateurPost);

        // THEN
        expect(console.error).toHaveBeenCalledWith(error);
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });
});
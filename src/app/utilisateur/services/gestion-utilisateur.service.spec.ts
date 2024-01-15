import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Utilisateur } from "src/app/models/utilisateur";
import { GestionUtilisateurService } from "./gestion-utilisateur.service";

describe('GestionUtilisateurService', () => {
    let service: GestionUtilisateurService;
    let httpTestingController: any;
    // url du back
    const urlUtilisateur = "http://localhost:8080/utilisateur";

    // Utilisateur à créér ou récupérer.
    const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };

    // Pour simuler une erreur interne coté back.
    const errorInterne = new HttpErrorResponse({
        error: new ErrorEvent('error', { message: 'Erreur interne du serveur' }),
        status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
        statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
    });

    // Pour simuler une erreur comme quoi l'utilisateur existe déjà coté back.
    const errorUtilisateurDejaExistant = new HttpErrorResponse({
        error: new ErrorEvent('error', { message: 'L utilisateur existe deja' }),
        status: 409, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
        statusText: 'L utilisateur existe deja', // Le texte du statut HTTP
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GestionUtilisateurService]
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(GestionUtilisateurService);
    });

    describe('connect de GestionUtilisateurService', () => {

        it('connect without error and user find', () => {
            // WHEN
            const resultat = service.connect(utilisateur.login, utilisateur.password);

            // THEN
            resultat.subscribe((user) => expect(user).toEqual(utilisateur));
            const req = httpTestingController.expectOne(`${urlUtilisateur}?login=${utilisateur.login}&password=${utilisateur.password}`);
            expect(req.request.method).toBe('GET');
            req.flush(utilisateur);
            httpTestingController.verify();
        });

        it('connect with error', () => {
            // GIVEN
            spyOn(console, 'error');

            // WHEN
            const resultat = service.connect('testLogin', 'testPassword');

            // THEN
            resultat.subscribe({ error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse)) });
            const req = httpTestingController.expectOne(`${urlUtilisateur}?login=${utilisateur.login}&password=${utilisateur.password}`);
            expect(req.request.method).toBe('GET');
            req.error(errorInterne);
            httpTestingController.verify();
        });
    });

    describe('disconnect de GestionUtilisateurService', () => {

        it('disconnect successful', () => {
            // GIVEN
            service.updateUtilisateurSubject(utilisateur);

            // WHEN
            service.disconnect();

            // THEN
            service.utilisateur$.subscribe((user) => expect(user).toEqual(null));
        });
    });

    describe('gestionErreurUtilisateur de GestionUtilisateurService', () => {

        it('gestionErreurUtilisateur with error', () => {
            // GIVEN
            const error = new Error("error");
            spyOn(console, 'error');

            // WHEN
            service.gestionErreurUtilisateur(error);

            // THEN
            expect(console.error).toHaveBeenCalledOnceWith(error);
            service.utilisateur$.subscribe({ error: err => expect(err).toEqual(error) });
        });
    });

    describe('addUtilisateur de GestionUtilisateurService', () => {

        it('addUtilisateur with error', () => {
            // GIVEN
            spyOn(console, 'error');

            // WHEN
            const resultat = service.addUtilisateur(utilisateur);

            // THEN
            resultat.subscribe({ error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse)) });
            const req = httpTestingController.expectOne(`${urlUtilisateur}`);
            expect(req.request.method).toBe('POST');
            req.error(errorInterne);
            httpTestingController.verify();

            expect(console.error).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
            service.utilisateur$.subscribe({ error: err => expect(err).toBeInstanceOf(HttpErrorResponse) });
        });

        it('addUtilisateur without error', () => {
            // WHEN
            const resultat = service.addUtilisateur(utilisateur).subscribe();

            // THEN
            const req = httpTestingController.expectOne(`${urlUtilisateur}`);
            expect(req.request.method).toBe('POST');
            req.flush(utilisateur);
            httpTestingController.verify();

            service.utilisateur$.subscribe(utilisateurReturn => expect(utilisateurReturn).toEqual(utilisateur));
        });
    });

    describe('register de GestionUtilisateurService', () => {

        const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };

        it('register without error', () => {
            // WHEN
            const resultat = service.addUtilisateur(utilisateur);

            // THEN
            resultat.subscribe((user) => expect(user).toEqual(utilisateur));
            const req = httpTestingController.expectOne(`${urlUtilisateur}`);
            expect(req.request.method).toBe('POST');
            req.flush(utilisateur);
            httpTestingController.verify();
            service.utilisateur$.subscribe(utilisateurReturn => expect(utilisateurReturn).toEqual(utilisateur));
        });

        it('register with error because email already exist', () => {
            // GIVEN
            spyOn(console, 'error');

            // WHEN
            const resultat = service.addUtilisateur(utilisateur);

            // THEN
            resultat.subscribe({ error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse)) });
            const req = httpTestingController.expectOne(urlUtilisateur);
            expect(req.request.method).toBe('POST');
            req.error(errorUtilisateurDejaExistant);
            httpTestingController.verify();
        });

        it('register with error in addUtilisateur', () => {
            // GIVEN
            spyOn(console, 'error');

            // WHEN
            const resultat = service.addUtilisateur(utilisateur);

            // THEN
            resultat.subscribe({ error: err => expect(console.error).toHaveBeenCalledWith(jasmine.any(HttpErrorResponse)) });
            const req = httpTestingController.expectOne(urlUtilisateur);
            expect(req.request.method).toBe('POST');
            req.error(errorInterne);
            httpTestingController.verify();
        });
    });
});
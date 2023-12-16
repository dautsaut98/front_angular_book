import { of, throwError } from "rxjs";
import { GestionUtilisateurService } from "./gestion-utilisateur.service";
import { Utilisateur } from "src/app/models/utilisateur";

describe('getUtilisateurs de GestionUtilisateurService',() => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    it('getUtilisateurs with error', () => {
        // GIVEN
        const error = new Error("error");
        mockHttpClient.get.and.returnValue(throwError(() => error));
        spyOn(console, 'error');

        // WHEN
        const resultat = service.getUtilisateurs();

        // THEN
        resultat.subscribe({
            error: err => expect(console.error).toHaveBeenCalledWith(error)
        });
    });

    it('getUtilisateurs without error', () => {
        // GIVEN
        mockHttpClient.get.and.returnValue(of(null));
        spyOn(console, 'info');

        // WHEN
        const resultat = service.getUtilisateurs();

        // THEN
        resultat.subscribe(() => expect(console.info).toHaveBeenCalled());
    });
});

describe('connect de GestionUtilisateurService',() => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    it('connect without error and user find', () => {
        // GIVEN
        // On simule le getUtilisateurs
        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        mockHttpClient.get.and.returnValue(of([utilisateur]));

        // WHEN
        const resultat = service.connect(utilisateur.login, utilisateur.password);

        // THEN
        resultat.subscribe(result => expect(result).toEqual(utilisateur));
    });

    it('connect without error and user not find', () => {
        // GIVEN
        // On simule le getUtilisateurs
        const utilisateur: Utilisateur = {id:1, email:'test@gmail.com', login:'testLogin', password:'testPassword', prenom:'testPrenom', nom:'testNom'};
        mockHttpClient.get.and.returnValue(of([utilisateur]));

        // WHEN
        const resultat = service.connect(utilisateur.login, '');

        // THEN
        resultat.subscribe((user) => expect(user).toEqual(null));
    });

    it('connect with error', () => {
        // GIVEN
        // On simule le getUtilisateurs
        const error = new Error("error");
        mockHttpClient.get.and.returnValue(throwError(() => error));

        // WHEN
        service.connect('testLogin', 'testPassword');

        // THEN
        service.utilisateur$.subscribe({error: err => expect(err).toEqual(error)});
    });
});

describe('disconnect de GestionUtilisateurService', () => {
    let service: GestionUtilisateurService;
    let mockHttpClient: any;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj(['get','post']);

        service = new GestionUtilisateurService(mockHttpClient);
    });

    it('disconnect successful', () => {
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

    it('gestionErreurUtilisateur with error', () => {
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

    it('addUtilisateur with error', () => {
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

    it('addUtilisateur without error', () => {
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

    it('register with error in addUtilisateur', () => {
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

    it('register without error', () => {
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

    it('register with error because email already exist', () => {
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

    it('register with error in getUtilisateurs', () => {
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
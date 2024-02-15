import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractControl, FormArray } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { Book } from "src/app/models/book";
import { GestionBookService } from "../../services/gestion-book.service";
import { AddBookComponent } from "./add-book.component";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

describe('AddBookComponent', () => {
    let fixture: ComponentFixture<AddBookComponent>;
    let mockGestionBookService: any;
    let router: Router;

    /**
     * Crée une copie d'un livre
     * @param book 
     * @returns le livre copié
     */
    function copyOfOneBook(book: Book): Book {
        return Object.assign({}, book);
    }

    /**
     * A partir d'une liste de livre ajout dans le control une liste de control rempli correspondant.
     * @param booksAdd liste des livres à transformer en form
     */
    function addFormBookFromList(booksAdd: Book[]) {
        let listeForm = (<FormArray>fixture.componentInstance.bookForm.get('books'));
        listeForm.clear();
        booksAdd.forEach(book => {
            // Permet de ne pas ajouter un formulaire de livre.
            fixture.componentInstance.addFormBook();

            // Rempli le dernier control non modifier avec le livre.
            listeForm.controls[listeForm.controls.length -1] = transformBookInForm(book, listeForm.controls[listeForm.controls.length -1]);
        });
        (<FormArray>fixture.componentInstance.bookForm.get('books')).controls = listeForm.controls;
    }

    /**
     * A partir d'un livre le transforme en control.
     * @param book 
     * @param formBookControl 
     * @returns 
     */
    function transformBookInForm(book: Book, formBookControl: AbstractControl): AbstractControl {
        formBookControl.get('nom').setValue(book.nom);
        formBookControl.get('description').setValue(book.description);
        formBookControl.get('dateParution').setValue(book.dateParution);
        formBookControl.get('lu').setValue(book.lu);
        formBookControl.get('prenomAuteur').setValue(book.prenomAuteur);
        formBookControl.get('nomAuteur').setValue(book.nomAuteur);
        return formBookControl;
    }

    beforeEach(() => {
        mockGestionBookService = jasmine.createSpyObj(['addBook']);
        TestBed.configureTestingModule({
            declarations: [AddBookComponent],
            providers: [
                { provide: GestionBookService, useValue: mockGestionBookService }
            ],
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(AddBookComponent);
        router = TestBed.inject(Router);
    });

    // Bloc de tests pour la fonction ngOnInit du composant
    describe('ngOnInit', () => {
        // Test unitaire pour la fonction ngOnInit
        it('test du ngOnInit', () => {
            // WHEN
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // THEN
            // Récupération des contrôles de formulaire de livres dans le FormArray
            const formBooks = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que le nombre de formulaires est égal à 1 après l'initialisation
            expect(formBooks.length).toEqual(1);

            // Récupération du contrôle de formulaire
            const formBookControl = formBooks[0];
            // Vérification que les valeurs du formulaire sont vides et que le formulaire n'est pas valide
            expect(formBookControl.get('nom').value).toEqual('');
            expect(formBookControl.get('description').value).toEqual('');
            expect(formBookControl.get('dateParution').value).toEqual('');
            expect(formBookControl.get('lu').value).toEqual(false);
            expect(formBookControl.get('prenomAuteur').value).toEqual('');
            expect(formBookControl.get('nomAuteur').value).toEqual('');
            expect(formBookControl.valid).toBeFalse();
        });

        // Test unitaire pour l'affichage des formulaires après l'initialisation
        it('test affichage form apres ngOnInit', () => {
            // WHEN
            // Numéro du formulaire de livre à tester
            const numFormBookTeste = 0;
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // THEN
            // Récupération des éléments HTML représentant les formulaires de livres
            const formBooks = fixture.debugElement.queryAll(By.css('.list-group-item'));
            // Vérification que le nombre d'éléments HTML représentant les formulaires est égal à numFormBookTeste + 1
            expect(formBooks.length).toEqual(numFormBookTeste + 1);

            // Récupération de l'élément HTML représentant le formulaire de livre testé
            const formBookControl = formBooks[numFormBookTeste];
            // Vérification que les valeurs des champs du formulaire sont vides
            expect(formBookControl.query(By.css(`#nom${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#description${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#dateParution${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#lu${numFormBookTeste}`)).nativeElement.checked).toBeFalse();
            expect(formBookControl.query(By.css(`#prenomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#nomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
        });
    });

    describe('addFormBook', () => {
        // Test unitaire pour l'ajout d'un formulaire côté TypeScript
        it('test ajout d un formulaire cote ts', () => {
            // GIVEN
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
    
            // WHEN
            // Ajout d'un formulaire de livre
            fixture.componentInstance.addFormBook();
            // Déclenchement du cycle de détection des modifications Angular après l'ajout
            fixture.detectChanges();
    
            // THEN
            // Récupération des contrôles de formulaire de livres dans le FormArray
            const formBooks = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que le nombre de formulaires est égal à 2 après l'ajout
            expect(formBooks.length).toEqual(2);
    
            // Récupération du contrôle de formulaire ajouté
            const formBookControl = formBooks[1];
            // Vérification que les valeurs du formulaire ajouté sont vides et que le formulaire n'est pas valide
            expect(formBookControl.get('nom').value).toEqual('');
            expect(formBookControl.get('description').value).toEqual('');
            expect(formBookControl.get('dateParution').value).toEqual('');
            expect(formBookControl.get('lu').value).toEqual(false);
            expect(formBookControl.get('prenomAuteur').value).toEqual('');
            expect(formBookControl.get('nomAuteur').value).toEqual('');
            expect(formBookControl.valid).toBeFalse();
        });
    
        // Test unitaire pour l'ajout d'un formulaire côté HTML
        it('test ajout d un formulaire cote html', () => {
            // GIVEN
            // Numéro du formulaire de livre à tester
            const numFormBookTeste = 1;
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
    
            // WHEN
            // Ajout d'un formulaire de livre
            fixture.componentInstance.addFormBook();
            // Déclenchement du cycle de détection des modifications Angular après l'ajout
            fixture.detectChanges();
    
            // THEN
            // Récupération des éléments HTML représentant les formulaires de livres
            const formBooks = fixture.debugElement.queryAll(By.css('.list-group-item'));
            // Vérification que le nombre d'éléments HTML représentant les formulaires est égal à numFormBookTeste + 1
            expect(formBooks.length).toEqual(numFormBookTeste + 1);
    
            // Récupération de l'élément HTML représentant le formulaire de livre ajouté
            const formBookControl = formBooks[numFormBookTeste];
            // Vérification que les valeurs des champs du formulaire ajouté sont vides
            expect(formBookControl.query(By.css(`#nom${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#description${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#dateParution${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#lu${numFormBookTeste}`)).nativeElement.checked).toBeFalse();
            expect(formBookControl.query(By.css(`#prenomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#nomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
        });
    });

    // Bloc de tests pour la fonction deleteFormBook du composant
    describe('deleteFormBook', () => {
        // Test unitaire pour la suppression d'un formulaire côté TypeScript
        it('test suppression d un formulaire cote ts', () => {
            // GIVEN
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Ajout d'un formulaire de livre
            fixture.componentInstance.addFormBook();

            // WHEN
            // Suppression du formulaire de livre à l'index 1
            fixture.componentInstance.deleteFormBook(1);
            // Déclenchement du cycle de détection des modifications Angular après l'ajout
            fixture.detectChanges();

            // THEN
            // Récupération des contrôles de formulaire de livres dans le FormArray
            const formBooks = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que le nombre de formulaires restants est égal à 1
            expect(formBooks.length).toEqual(1);

            // Récupération du contrôle de formulaire restant
            const formBookControl = formBooks[0];
            // Vérification que les valeurs du formulaire sont réinitialisées
            expect(formBookControl.get('nom').value).toEqual('');
            expect(formBookControl.get('description').value).toEqual('');
            expect(formBookControl.get('dateParution').value).toEqual('');
            expect(formBookControl.get('lu').value).toEqual(false);
            expect(formBookControl.get('prenomAuteur').value).toEqual('');
            expect(formBookControl.get('nomAuteur').value).toEqual('');
            // Vérification que le formulaire n'est pas valide
            expect(formBookControl.valid).toBeFalse();
        });

        // Test unitaire pour la suppression d'un formulaire côté HTML
        it('test suppression d un formulaire cote html', () => {
            // GIVEN
            // Numéro du formulaire de livre à tester
            const numFormBookTeste = 0;
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Ajout d'un formulaire de livre
            fixture.componentInstance.addFormBook();

            // WHEN
            // Suppression du formulaire de livre à l'index 1
            fixture.componentInstance.deleteFormBook(1);
            // Déclenchement du cycle de détection des modifications Angular après l'ajout
            fixture.detectChanges();

            // THEN
            // Récupération des éléments HTML représentant les formulaires de livres
            const formBooks = fixture.debugElement.queryAll(By.css('.list-group-item'));
            // Vérification que le nombre d'éléments HTML représentant les formulaires est égal à numFormBookTeste + 1
            expect(formBooks.length).toEqual(numFormBookTeste + 1);

            // Récupération de l'élément HTML représentant le formulaire de livre testé
            const formBookControl = formBooks[numFormBookTeste];
            // Vérification que les valeurs des champs du formulaire sont réinitialisées
            expect(formBookControl.query(By.css(`#nom${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#description${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#dateParution${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#lu${numFormBookTeste}`)).nativeElement.checked).toBeFalse();
            expect(formBookControl.query(By.css(`#prenomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
            expect(formBookControl.query(By.css(`#nomAuteur${numFormBookTeste}`)).nativeElement.value).toEqual('');
        });
    });


    // Bloc de tests pour la fonction transformFormInBook du composant
    describe('transformFormInBook', () => {
        // Test unitaire pour le scénario de la transformation d'un formulaire en livre
        it('test de la transformation d un form en book', () => {
            // GIVEN
            // Création d'un objet book pour les tests
            const book = { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' };
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // Récupération du contrôle de formulaire correspondant au premier livre dans le FormArray
            const formBookControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls[0];
            // Attribution des valeurs du livre au formulaire
            formBookControl.get('nom').setValue(book.nom);
            formBookControl.get('description').setValue(book.description);
            formBookControl.get('dateParution').setValue(book.dateParution);
            formBookControl.get('lu').setValue(book.lu);
            formBookControl.get('prenomAuteur').setValue(book.prenomAuteur);
            formBookControl.get('nomAuteur').setValue(book.nomAuteur);

            // WHEN
            // Appel de la fonction de transformation
            const result = fixture.componentInstance.transformFormInBook(formBookControl);

            // THEN
            // Vérification que le résultat de la transformation est égal à l'objet book attendu
            expect(result).toEqual(book);
        });
    });


    // Bloc de tests pour la fonction gestionErreurAddBook du composant
    describe('gestionErreurAddBook', () => {
        // Test unitaire pour le scénario où la valeur d'entrée est 409
        it('gestionErreurAddBook avec comme valeur d entree 409', () => {
            // GIVEN
            const valeurEntree = 409;
            const valeurSortie = { bookDejaExistant: true };

            // WHEN
            const result = fixture.componentInstance.gestionErreurAddBook(valeurEntree);

            // THEN
            // Vérification que la fonction retourne la valeur de sortie attendue
            expect(result).toEqual(valeurSortie);
        });

        // Test unitaire pour le scénario où la valeur d'entrée est 404
        it('gestionErreurAddBook avec comme valeur d entree 404', () => {
            // GIVEN
            const valeurEntree = 404;
            const valeurSortie = { UtilisateurNotFound: true };

            // WHEN
            const result = fixture.componentInstance.gestionErreurAddBook(valeurEntree);

            // THEN
            // Vérification que la fonction retourne la valeur de sortie attendue
            expect(result).toEqual(valeurSortie);
        });

        // Test unitaire pour le scénario où la valeur d'entrée est 500
        it('gestionErreurAddBook avec comme valeur d entree 500', () => {
            // GIVEN
            const valeurEntree = 500;
            const valeurSortie = { erreurLorsDeLEnregistrement: true };

            // WHEN
            const result = fixture.componentInstance.gestionErreurAddBook(valeurEntree);

            // THEN
            // Vérification que la fonction retourne la valeur de sortie attendue
            expect(result).toEqual(valeurSortie);
        });

        // Test unitaire pour le scénario où la valeur d'entrée est 999
        it('gestionErreurAddBook avec comme valeur d entree 999', () => {
            // GIVEN
            const valeurEntree = 999;
            const valeurSortie = { erreurLorsDeLEnregistrement: true };

            // WHEN
            const result = fixture.componentInstance.gestionErreurAddBook(valeurEntree);

            // THEN
            // Vérification que la fonction retourne la valeur de sortie attendue
            expect(result).toEqual(valeurSortie);
        });
    });


    describe('isDoublonsInListeAddBook', () => {
        // Définition d'une liste de livres pour les tests
        const books: Book[] = [
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook2', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
        ];

        // Test unitaire pour le scénario où isDoublonsInListeAddBook ne trouve pas de doublons dans la liste d'ajout
        it('isDoublonsInListeAddBook sans doublons dans la liste d ajout', () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 3);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            const result: Boolean = fixture.componentInstance.isDoublonsInListeAddBook();

            // THEN
            // Vérification que la fonction retourne false, ce qui signifie qu'il n'y a pas de doublons
            expect(result).toBeFalse();

            // Vérification de l'état des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 3
            expect(listeControl.length).toEqual(3);
            // Vérification que tous les contrôles n'ont pas d'erreur 'bookDejaExistant' définie
            expect(listeControl[0]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[1]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[2]?.errors?.['bookDejaExistant']).toBeUndefined();
        });

        // Test unitaire pour le scénario où isDoublonsInListeAddBook trouve un doublon dans la liste d'ajout
        it('isDoublonsInListeAddBook avec un doublon dans la liste d ajout', () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 4);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            const result: Boolean = fixture.componentInstance.isDoublonsInListeAddBook();

            // THEN
            // Vérification que la fonction retourne true, ce qui signifie qu'il y a des doublons
            expect(result).toBeTrue();

            // Vérification de l'état des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 4
            expect(listeControl.length).toEqual(4);
            // Vérification que le premier contrôle a l'erreur 'bookDejaExistant' définie
            expect(listeControl[0].errors['bookDejaExistant']).toBeTrue();
            // Vérification que les autres contrôles n'ont pas d'erreur 'bookDejaExistant' définie
            expect(listeControl[1]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[2]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[3].errors['bookDejaExistant']).toBeTrue();
        });

        // Test unitaire pour le scénario où isDoublonsInListeAddBook ne trouve pas de doublons par rapport à la liste de livres de l'utilisateur en back
        it('isDoublonsInListeAddBook sans doublons par rapport à la liste de livre de l utilisateur en back', () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [books[2]] });
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            const result: Boolean = fixture.componentInstance.isDoublonsInListeAddBook();

            // THEN
            // Vérification que la fonction retourne false, ce qui signifie qu'il n'y a pas de doublons
            expect(result).toBeFalse();

            // Vérification de l'état des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 2
            expect(listeControl.length).toEqual(2);
            // Vérification que tous les contrôles n'ont pas d'erreur 'bookDejaExistant' définie
            expect(listeControl[0]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[1]?.errors?.['bookDejaExistant']).toBeUndefined();
        });

        // Test unitaire pour le scénario où isDoublonsInListeAddBook trouve un doublon par rapport à la liste de livres de l'utilisateur en back
        it('isDoublonsInListeAddBook avec un doublon par rapport à la liste de livre de l utilisateur en back', () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 3);
            Object.defineProperty(mockGestionBookService, 'books', { value: [books[0]] });
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            const result: Boolean = fixture.componentInstance.isDoublonsInListeAddBook();

            // THEN
            // Vérification que la fonction retourne true, ce qui signifie qu'il y a des doublons
            expect(result).toBeTrue();
            
            // Vérification de l'état des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 3
            expect(listeControl.length).toEqual(3);
            // Vérification que le premier contrôle a l'erreur 'bookDejaExistant' définie
            expect(listeControl[0].errors['bookDejaExistant']).toBeTrue();
            // Vérification que les autres contrôles n'ont pas d'erreur 'bookDejaExistant' définie
            expect(listeControl[1]?.errors?.['bookDejaExistant']).toBeUndefined();
            expect(listeControl[2]?.errors?.['bookDejaExistant']).toBeUndefined();
        });
    });


    describe('addBook', () => {
        // Définition d'une liste de livres pour les tests
        const books: Book[] = [
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook2', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
        ];

        // Test unitaire pour le scénario où addBook s'arrête car isDoublons renvoie true
        it(`addBook s'arrête car isDoublons renvoie true`, () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [books[4]] });
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(0);
            expect(router.navigate).toHaveBeenCalledTimes(0);
        });

        // Test unitaire pour le scénario où addBook de GestionBookService ne renvoie pas d'erreur
        it(`addBook avec addBook de GestionBookService qui ne renvoie pas d'erreur`, () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });
            mockGestionBookService.addBook.and.returnValue(of(books[0]));
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(2);
            expect(router.navigate).toHaveBeenCalledWith(['/libraire']);
        });

        // Test unitaire pour le scénario où addBook de GestionBookService renvoie une erreur 409 et un succès
        it(`addBook avec addBook de GestionBookService renvoie une erreur 409 et un ok`, () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });

            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'livre déjà existant' }),
                status: 409,
                statusText: 'livre déjà existant',
            });
            // Configuration du mock de GestionBookService pour retourner une erreur 409, puis un livre (books[0])
            mockGestionBookService.addBook.and.returnValues(
                throwError(() => error),
                of(books[0])
            );
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            // Vérification que la méthode addBook a été appelée deux fois (une pour l'erreur, une pour le succès)
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(2);
            // Vérification que la méthode navigate du Router a été appelée une fois
            expect(router.navigate).toHaveBeenCalledTimes(1);
            // Récupération de la liste des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 2
            expect(listeControl.length).toEqual(2);
            expect(listeControl[0].errors['bookDejaExistant']).toBeTrue();
            expect(listeControl[1]?.errors).toBeNull();
        });

        // Test unitaire pour le scénario où addBook de GestionBookService renvoie une erreur 500 et un succès
        it(`addBook avec addBook de GestionBookService renvoie une erreur 500 et un ok`, () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });

            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'erreur interne' }),
                status: 500,
                statusText: 'erreur interne',
            });
            // Configuration du mock de GestionBookService pour retourner une erreur 500, puis un livre (books[0])
            mockGestionBookService.addBook.and.returnValues(
                throwError(() => error),
                of(books[0])
            );
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            // Vérification que la méthode addBook a été appelée deux fois (une pour l'erreur, une pour le succès)
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(2);
            // Vérification que la méthode navigate du Router a été appelée une fois
            expect(router.navigate).toHaveBeenCalledTimes(1);
            // Récupération de la liste des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 2
            expect(listeControl.length).toEqual(2);
            expect(listeControl[0].errors['erreurLorsDeLEnregistrement']).toBeTrue();
            expect(listeControl[1]?.errors).toBeNull();
        });

        // Test unitaire pour le scénario où addBook de GestionBookService renvoie une erreur 999 et un succès
        it(`addBook avec addBook de GestionBookService renvoie une erreur 999 et un ok`, () => {
            // GIVEN
            const booksTest: Book[] = books.slice(0, 2);
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });

            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'erreur inconnu' }),
                status: 999,
                statusText: 'erreur inconnu',
            });
            // Configuration du mock de GestionBookService pour retourner une erreur 999, puis un livre (books[0])
            mockGestionBookService.addBook.and.returnValues(
                throwError(() => error),
                of(books[0])
            );
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            // Vérification que la méthode addBook a été appelée deux fois (une pour l'erreur, une pour le succès)
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(2);
            // Vérification que la méthode navigate du Router a été appelée une fois
            expect(router.navigate).toHaveBeenCalledTimes(1);
            // Récupération de la liste des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 2
            expect(listeControl.length).toEqual(2);
            expect(listeControl[0].errors['erreurLorsDeLEnregistrement']).toBeTrue();
            expect(listeControl[1]?.errors).toBeNull();
        });

        // Test unitaire pour le scénario où addBook de GestionBookService renvoie une erreur 409 et un succès
        it(`addBook avec addBook de GestionBookService renvoie une erreur 409 et un ok`, () => {
            // GIVEN
            // Création d'une liste de livres pour les tests
            const booksTest: Book[] = books.slice(0, 2);
            // Configuration du mock de GestionBookService avec une liste de livres vide
            Object.defineProperty(mockGestionBookService, 'books', { value: [] });
            // Création d'une erreur HTTP simulée avec le statut 404 (utilisateur introuvable)
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'utilisateur introuvable' }),
                status: 404,
                statusText: 'utilisateur introuvable',
            });
            // Configuration du mock de GestionBookService pour retourner une erreur 404, puis un livre (books[0])
            mockGestionBookService.addBook.and.returnValues(
                throwError(() => error),
                of(books[0])
            );
            // Spy sur la méthode navigate du Router
            spyOn(router, 'navigate');
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);

            // WHEN
            fixture.componentInstance.addBook();

            // THEN
            // Vérification que la méthode addBook a été appelée deux fois (une pour l'erreur, une pour le succès)
            expect(mockGestionBookService.addBook).toHaveBeenCalledTimes(2);
            // Vérification que la méthode navigate du Router a été appelée une fois
            expect(router.navigate).toHaveBeenCalledTimes(1);
            // Récupération de la liste des contrôles de formulaire dans le composant
            let listeControl = (<FormArray>fixture.componentInstance.bookForm.get('books')).controls;
            // Vérification que la liste des contrôles a une longueur de 2
            expect(listeControl.length).toEqual(2);
            // Vérification que le premier contrôle a l'erreur 'UtilisateurNotFound' définie
            expect(listeControl[0].errors['UtilisateurNotFound']).toBeTrue();
            // Vérification que le deuxième contrôle n'a pas d'erreurs définies (doit être null)
            expect(listeControl[1]?.errors).toBeNull();
        });
    });

    describe('validation du formulaire', () => {
        // Définition d'une liste de livres pour les tests
        const books: Book[] = [
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook2', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
            { id: -1, nom: 'nomBook1', dateParution: '05/07/1998', description: 'description du livre', idUser: -1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur' },
        ];

        it(`test d'un formulaire valide`, () => {
            // GIVEN
            // Création d'une liste de livres pour les tests
            const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // WHEN
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // THEN
            // Vérification que le formulaire est valide
            expect(fixture.componentInstance.bookForm.valid).toBeTrue();
        });

        it(`test de deux formulaires valides`, () => {
            // GIVEN
            // Création d'une liste de livres pour les tests
            const booksTest: Book[] = books.slice(0, 2).map(book => copyOfOneBook(book));
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();
            debugger;

            // WHEN
            // Pré-remplissage de la liste des formulaires de livres dans le composant
            addFormBookFromList(booksTest);
            // Déclenchement du cycle de détection des modifications Angular
            fixture.detectChanges();

            // THEN
            // Vérification que le formulaire est valide
            expect(fixture.componentInstance.bookForm.valid).toBeTrue();
        });

        describe('test formulaire invalide car un des champs non rempli', () => {
            it(`test d'un formulaire invalide car nom non rempli`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].nom='';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car description non rempli`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].description='';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car dateParution non rempli`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].dateParution='';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car prenomAuteur non rempli`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].prenomAuteur='';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car nomAuteur non rempli`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].nomAuteur='';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });
        });
  
        describe('test formulaire invalide car un des champs pas à la taille minimum', () => {
            it(`test d'un formulaire invalide car nom pas à la taille minimum`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].nom='no';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car description pas à la taille minimum`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].description='de';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car dateParution pas à la taille minimum`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].dateParution='05';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car prenomAuteur pas à la taille minimum`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].prenomAuteur='pr';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });

            it(`test d'un formulaire invalide car nomAuteur pas à la taille minimum`, () => {
                // GIVEN
                // Création d'une liste de livres pour les tests
                const booksTest: Book[] = books.slice(0, 1).map(book => copyOfOneBook(book));
                booksTest[0].nomAuteur='no';
                // Déclenchement du cycle de détection des modifications Angular
                fixture.detectChanges();
    
                // WHEN
                // Pré-remplissage de la liste des formulaires de livres dans le composant
                addFormBookFromList(booksTest);
    
                // THEN
                // Vérification que le formulaire est valide
                expect(fixture.componentInstance.bookForm.valid).toBeFalse();
            });
        });
    });
});
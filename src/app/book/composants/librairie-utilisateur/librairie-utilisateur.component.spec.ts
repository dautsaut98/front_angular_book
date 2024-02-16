import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of, throwError } from "rxjs";
import { Book } from "src/app/models/book";
import { GestionUtilisateurService } from "src/app/utilisateur/services/gestion-utilisateur.service";
import { GestionBookService } from "../../services/gestion-book.service";
import { LibrairieUtilisateurComponent } from "./librairie-utilisateur.component";

describe('LibrairieUtilisateurComponent', () => {
    @Component({
        selector: 'app-detail-book',
        template: '<div></div>',
    })
    class FakeDetailBookComponent {
        @Input() book: Book;
    }
    let fixture: ComponentFixture<LibrairieUtilisateurComponent>;
    let mockGestionUtilisateurService: any;
    let mockGestionBookService: any;

    beforeEach(() => {
        mockGestionUtilisateurService = jasmine.createSpyObj(['']);
        mockGestionBookService = jasmine.createSpyObj<GestionBookService>(['getBooks']);

        TestBed.configureTestingModule({
            declarations: [
                LibrairieUtilisateurComponent,
                FakeDetailBookComponent
            ],
            imports: [HttpClientTestingModule],
            providers: [
                { provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService },
                { provide: GestionBookService, useValue: mockGestionBookService },
                // On va le réécrire dans les tests sur les filtres.
                { provide: ActivatedRoute, useValue: { queryParams: of(null), snapshot: null } }
            ],
        });
    });

    describe('test ngOnInit', () => {

        const book = { id: 0, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: 1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur', srcImage: '' };

        beforeEach(() => {
            // Car j'ai besoin dans des test du filtre d'overwrite avant la creation.
            fixture = TestBed.createComponent(LibrairieUtilisateurComponent);

            Object.defineProperty(mockGestionUtilisateurService, 'utilisateur$', { value: of(null) });
        });

        it('test getBooks renvoie une erreur', () => {
            // GIVEN
            // On créé l'erreur.
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'Erreur interne du serveur' }),
                status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
                statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
            });
            mockGestionBookService.getBooks.and.returnValue(throwError(() => error));

            // On defini la liste des livres pour vérifier qu'elle retourne à 0.
            fixture.componentInstance.listeLivre = [book];

            // WHEN
            fixture.detectChanges();

            // THEN
            console.log('Liste Livre:', fixture.componentInstance.listeLivre);
            expect(fixture.componentInstance.listeLivre.length).toEqual(0);
        });

        it('test getBooks ne renvoie pas une erreur', () => {
            // GIVEN
            mockGestionBookService.getBooks.and.returnValue(of([book]));

            // WHEN
            fixture.detectChanges();

            // THEN
            console.log('Liste Livre:', fixture.componentInstance.listeLivre);
            expect(fixture.componentInstance.listeLivre).toEqual([book]);
        });
    });

    describe('test getBooks interne plus affichage de la liste', () => {

        const books: Book[] = [
            { id: 0, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: 1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur', srcImage: '' },
            { id: 1, nom: 'nomBook2', dateParution: '05/07/1998', description: 'description du livre', idUser: 1, lu: true, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur', srcImage: '' },
        ];

        beforeEach(() => {
            Object.defineProperty(mockGestionUtilisateurService, 'utilisateur$', { value: of(null) });
            mockGestionBookService.getBooks.and.returnValue(of(books));
        });

        it('test getBooks interne avec le filtre vide', () => {
            // GIVEN
            TestBed.overrideProvider(ActivatedRoute, {
                useValue: {
                  queryParams: of({ filter: '' }),
                  snapshot: {
                    paramMap: convertToParamMap({ filter: '' })
                    }
                }
            });
            fixture = TestBed.createComponent(LibrairieUtilisateurComponent);
            fixture.detectChanges();

            // WHEN
            const result = fixture.componentInstance.getBooks();

            // THEN
            expect(result).toEqual(books);

            const listeBookEL = fixture.debugElement.queryAll(By.css('.list-group app-detail-book'));
            expect(listeBookEL.length).toEqual(books.length);
            expect(listeBookEL.map(bookEl => bookEl.componentInstance.book)).toEqual(books);
        });

        it('test getBooks interne avec le filtre lu', () => {
            // GIVEN
            TestBed.overrideProvider(ActivatedRoute, {
                useValue: {
                  queryParams: of({ filter: 'lu' }),
                  snapshot: {
                    paramMap: convertToParamMap({ filter: 'lu' })
                    }
                }
            });
            fixture = TestBed.createComponent(LibrairieUtilisateurComponent);
            fixture.detectChanges();
            const listeBook = books.filter(book => book.lu);

            // WHEN
            const result = fixture.componentInstance.getBooks();

            // THEN
            expect(result).toEqual(listeBook);

            const listeBookEL = fixture.debugElement.queryAll(By.css('.list-group app-detail-book'));
            expect(listeBookEL.length).toEqual(listeBook.length);
            expect(listeBookEL.map(bookEl => bookEl.componentInstance.book)).toEqual(listeBook);
        });

        it('test getBooks interne avec le filtre nonLu', () => {
            TestBed.overrideProvider(ActivatedRoute, {
                useValue: {
                  queryParams: of({ filter: 'nonLu' }),
                  snapshot: {
                    paramMap: convertToParamMap({ filter: 'nonLu' })
                    }
                }
            });
            fixture = TestBed.createComponent(LibrairieUtilisateurComponent);
            fixture.detectChanges();
            const listeBook = books.filter(book => !book.lu);

            // WHEN
            const result = fixture.componentInstance.getBooks();

            // THEN
            expect(result).toEqual(listeBook);
            const listeBookEL = fixture.debugElement.queryAll(By.css('.list-group app-detail-book'));
            expect(listeBookEL.length).toEqual(listeBook.length);
            expect(listeBookEL.map(bookEl => bookEl.componentInstance.book)).toEqual(listeBook);
        });
    });
});
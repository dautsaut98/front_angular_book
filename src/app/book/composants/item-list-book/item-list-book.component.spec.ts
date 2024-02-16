import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemListBookComponent } from "./item-list-book.component";
import { Book } from "src/app/models/book";
import { By } from "@angular/platform-browser";

describe('DetailBookComponent', () => {
    let fixture: ComponentFixture<ItemListBookComponent>;
    let book: Book;

    beforeEach(() => {
        book = { id: 0, nom: 'nomBook', dateParution: '05/07/1998', description: 'description du livre', idUser: 1, lu: false, nomAuteur: 'nomAuteur', prenomAuteur: 'prenomAuteur', srcImage: '' };
        TestBed.configureTestingModule({
            declarations:[ItemListBookComponent]
        });
        fixture = TestBed.createComponent(ItemListBookComponent);
    });

    describe('test d affichage du composant et de ses elements', () => {
        it('test si les valeurs du livre affiche', () => {
            // GIVEN
            fixture.componentInstance.book = book;

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeTrue();

            const debug = fixture.debugElement;
            expect(debug.query(By.css('#detailBook'))).not.toBeNull();
            expect(debug.query(By.css('#nom')).nativeElement.textContent).toBe(book.nom);
            expect(debug.query(By.css('#description')).nativeElement.textContent).toBe(book.description);
            expect(debug.query(By.css('#dateParution')).nativeElement.textContent).toBe(book.dateParution);
        });

        it('test si les valeurs du livre non affiche', () => {
            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeFalse();
    
            const debug = fixture.debugElement;
            expect(debug.query(By.css('#detailBook'))).toBeNull();
            expect(debug.query(By.css('#nom'))).toBeNull();
            expect(debug.query(By.css('#description'))).toBeNull();
            expect(debug.query(By.css('#dateParution'))).toBeNull();
        });
    });

    describe('test de la methode determineIsAffichable', () => {
        it('determineIsAffichable false car le livre est null', () => {
            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeFalse();
            expect(fixture.debugElement.query(By.css('#detailBook'))).toBeNull();
        });

        it('determineIsAffichable false car le nom du livre est null', () => {
            // GIVEN
            book.nom = null;
            fixture.componentInstance.book = book;
    
            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeFalse();
            expect(fixture.debugElement.query(By.css('#detailBook'))).toBeNull();
        });

        it('determineIsAffichable false car la description du livre est null', () => {
            // GIVEN
            book.description = null;
            fixture.componentInstance.book = book;

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeFalse();
            expect(fixture.debugElement.query(By.css('#detailBook'))).toBeNull();
        });

        it('determineIsAffichable false car la dateParution du livre est null', () => {
            // GIVEN
            book.dateParution = null;
            fixture.componentInstance.book = book;

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeFalse();
            expect(fixture.debugElement.query(By.css('#detailBook'))).toBeNull();
        });

        it('determineIsAffichable true car le livre et ses element affiches sont non nulls', () => {
            // GIVEN
            fixture.componentInstance.book = book;

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.componentInstance.determineIsAffichable()).toBeTrue();
            expect(fixture.debugElement.query(By.css('#detailBook'))).not.toBeNull();
        });
    });
});
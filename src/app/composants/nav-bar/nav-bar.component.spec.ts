import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { Utilisateur } from "src/app/models/utilisateur";
import { GestionUtilisateurService } from "src/app/utilisateur/services/gestion-utilisateur.service";
import { NavBarComponent } from "./nav-bar.component";

describe('NavBarComponent', () => {
    let fixture: ComponentFixture<NavBarComponent>;
    let mockGestionUtilisateurService: any;
    let router: Router;

    beforeEach(() => {
        mockGestionUtilisateurService = jasmine.createSpyObj<GestionUtilisateurService>(['disconnect']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
                NavBarComponent
            ],
            providers: [
                { provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService }
            ]
        });
        fixture = TestBed.createComponent(NavBarComponent);
        router = TestBed.inject(Router);
    });

    describe('test affichage de la navBar', () => {
        it('test navbar cache', () => {
            // GIVEN
            Object.defineProperty(mockGestionUtilisateurService, 'utilisateur$', { value: of(null) });

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.debugElement.query(By.css('nav'))).toBeNull();
        });

        it('test navbar non cache', () => {
            // GIVEN
            const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };
            Object.defineProperty(mockGestionUtilisateurService, 'utilisateur$', { value: of(utilisateur) });

            // WHEN
            fixture.detectChanges();

            // THEN
            expect(fixture.debugElement.query(By.css('nav'))).not.toBeNull();
        });
    });

    it('test disconnect', () => {
        // GIVEN
        Object.defineProperty(mockGestionUtilisateurService, 'utilisateur$', { value: of(null) });
        mockGestionUtilisateurService.disconnect.and.stub();
        spyOn(router, 'navigate');
        fixture.detectChanges();

        // WHEN
        fixture.componentInstance.disconnect();

        // THEN
        expect(router.navigate).toHaveBeenCalledOnceWith(["/login"]);
    });
});
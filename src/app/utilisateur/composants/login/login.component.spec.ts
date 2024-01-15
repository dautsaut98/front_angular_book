import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { GestionUtilisateurService } from "../../services/gestion-utilisateur.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Utilisateur } from "src/app/models/utilisateur";
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from "@angular/router";

describe("LoginComposant", () =>{
    let fixture: ComponentFixture<LoginComponent>;
    let mockGestionUtilisateurService: any;
    let router: Router;

    beforeEach(() => {
        mockGestionUtilisateurService = jasmine.createSpyObj(['connect']);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
              LoginComponent
            ],
            providers: [
              { provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(LoginComponent);
    });

    describe("ngOnInit", () => {
        it("test du ngOnInit", () => {
            // WHEN
            fixture.detectChanges();

            // THEN
            const loginForm = fixture.componentInstance.loginForm;
            expect(loginForm?.get('login')?.value).toEqual('');
            expect(loginForm?.get('password')?.value).toEqual('');
            expect(loginForm?.errors).toBeNull();
            expect(loginForm?.valid).toBeFalse();
        });
    });

    describe('login', () => {

        beforeEach(() => {
            fixture.detectChanges();
        });

        it('login with error', () => {
            // GIVEN
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'Erreur interne du serveur' }),
                status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
                statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
              });
            mockGestionUtilisateurService.connect.and.returnValue(throwError(() => error));

            // WHEN
            fixture.componentInstance.login();

            // THEN
            const loginForm = fixture.componentInstance.loginForm;
            expect(loginForm?.errors['connectionServeur']).toBeTrue();
            expect(loginForm?.valid).toBeFalse();
        });

        it('login without error', () => {
            // GIVEN
            const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };
            mockGestionUtilisateurService.connect.and.returnValue(of(utilisateur));
            spyOn(router, 'navigate');

            // WHEN
            fixture.componentInstance.login();

            // THEN
            expect(router.navigate).toHaveBeenCalledOnceWith(["/libraire"]);
            const loginForm = fixture.componentInstance.loginForm;
            expect(loginForm?.errors).toBeNull();
            expect(loginForm?.valid).toBeFalse();
        });
    })

    describe('test du formulaire', () => {
        it('test du formulaire valide', () => {
            // GIVEN
            fixture.detectChanges();
            let loginForm = fixture.componentInstance.loginForm;

            // WHEN
            loginForm.get('login').setValue('testLogin');
            loginForm.get('password').setValue('testPassword');

            // THEN
            expect(loginForm?.valid).toBeTrue();
        });

        describe('test champ trop petit', () => {
            it('test du formulaire non valide car login trop petit', () => {
                // GIVEN
                fixture.detectChanges();
                let loginForm = fixture.componentInstance.loginForm;
    
                // WHEN
                loginForm.get('login').setValue('tL');
                loginForm.get('password').setValue('testPassword');
    
                // THEN
                expect(loginForm?.valid).toBeFalse();
            });
    
            it('test du formulaire non valide car password trop petit', () => {
                // GIVEN
                fixture.detectChanges();
                let loginForm = fixture.componentInstance.loginForm;
    
                // WHEN
                loginForm.get('login').setValue('testLogin');
                loginForm.get('password').setValue('tP');
    
                // THEN
                expect(loginForm?.valid).toBeFalse();
            });
        });

        describe('test champ non rempli', () => {
            it('test du formulaire non valide car login non rempli', () => {
                // GIVEN
                fixture.detectChanges();
                let loginForm = fixture.componentInstance.loginForm;
    
                // WHEN
                loginForm.get('password').setValue('testLogin');
    
                // THEN
                expect(loginForm?.valid).toBeFalse();
            });
    
            it('test du formulaire non valide car password non rempli', () => {
                // GIVEN
                fixture.detectChanges();
                let loginForm = fixture.componentInstance.loginForm;
    
                // WHEN
                loginForm.get('login').setValue('testPassword');
    
                // THEN
                expect(loginForm?.valid).toBeFalse();
            });
    
            it('test du formulaire non valide car login et password non rempli', () => {
                // GIVEN
                fixture.detectChanges();
                let loginForm = fixture.componentInstance.loginForm;
    
                // THEN
                expect(loginForm?.valid).toBeFalse();
            });
        });
    });
});
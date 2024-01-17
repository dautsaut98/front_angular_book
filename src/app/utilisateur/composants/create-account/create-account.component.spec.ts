import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateAccountComponent } from "./create-account.component";
import { Router } from "@angular/router";
import { RouterTestingModule } from '@angular/router/testing';
import { GestionUtilisateurService } from "../../services/gestion-utilisateur.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, throwError } from "rxjs";
import { Utilisateur } from "src/app/models/utilisateur";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe('CreateAccountComponent', () => {
    let fixture: ComponentFixture<CreateAccountComponent>;
    let router: Router;
    let mockGestionUtilisateurService: any;

    beforeEach(() => {
        mockGestionUtilisateurService = jasmine.createSpyObj(['addUtilisateur']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
                CreateAccountComponent
            ],
            providers: [
                { provide: GestionUtilisateurService, useValue: mockGestionUtilisateurService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(CreateAccountComponent);
    });

    describe('ngOnInit', () => {
        it('test ngOnInit', () => {
            // WHEN
            fixture.detectChanges();

            // THEN
            const createAccountForm = fixture.componentInstance.createAccountForm;
            expect(createAccountForm.get('login').value).toBe('');
            expect(createAccountForm.get('prenom').value).toBe('');
            expect(createAccountForm.get('nom').value).toBe('');
            expect(createAccountForm.get('password').value).toBe('');

            expect(createAccountForm.get('emailGroup').get('email').value).toBe('');
            expect(createAccountForm.get('emailGroup').get('emailConfirm').value).toBe('');
            expect(createAccountForm.get('emailGroup').valid).toBeFalse();
            expect(createAccountForm.valid).toBeFalse();
        });

        it('test affichage form apres ngOnInit', () => {
            // WHEN
            fixture.detectChanges();

            // THEN
            const debug = fixture.debugElement;
            expect(debug.query(By.css('#login')).nativeElement.value).toEqual('');
            expect(debug.query(By.css('#prenom')).nativeElement.value).toEqual('');
            expect(debug.query(By.css('#nom')).nativeElement.value).toEqual('');
            expect(debug.query(By.css('#password')).nativeElement.value).toEqual('');
            expect(debug.query(By.css('#email')).nativeElement.value).toEqual('');
            expect(debug.query(By.css('#emailConfirm')).nativeElement.value).toEqual('');
        });
    });

    describe('register', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('register sans erreur', () => {
            // GIVEN
            const utilisateur: Utilisateur = { id: 1, email: 'test@gmail.com', login: 'testLogin', password: 'testPassword', prenom: 'testPrenom', nom: 'testNom' };
            mockGestionUtilisateurService.addUtilisateur.and.returnValue(of(utilisateur));
            spyOn(router, 'navigate');

            // WHEN
            fixture.componentInstance.register();

            // THEN
            expect(router.navigate).toHaveBeenCalledOnceWith(["/libraire"]);
        });

        it('register avec erreur', () => {
            // GIVEN
            const error = new HttpErrorResponse({
                error: new ErrorEvent('error', { message: 'Erreur interne du serveur' }),
                status: 500, // Le statut HTTP de l'erreur (500 pour une erreur serveur, par exemple)
                statusText: 'Erreur interne du serveur', // Le texte du statut HTTP
            });
            mockGestionUtilisateurService.addUtilisateur.and.returnValue(throwError(() => error));

            // WHEN
            fixture.componentInstance.register();

            // THEN
            const createAccountForm = fixture.componentInstance.createAccountForm;
            expect(createAccountForm?.errors['connectionServeur']).toBeTrue();
            expect(createAccountForm?.valid).toBeFalse();
        });
    });

    describe('test du formulaire', () => {

        let createAccountForm: FormGroup;

        beforeEach(() => {
            fixture.detectChanges();
            createAccountForm = fixture.componentInstance.createAccountForm;
            createAccountForm.get('login').setValue('login');
            createAccountForm.get('prenom').setValue('prenom');
            createAccountForm.get('nom').setValue('nom');
            createAccountForm.get('password').setValue('password');
            createAccountForm.get('emailGroup').get('email').setValue('email@gmail.com');
            createAccountForm.get('emailGroup').get('emailConfirm').setValue('email@gmail.com');
        });

        it('formulaire valide', () => {
            // THEN
            expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
            expect(createAccountForm?.valid).toBeTrue();
        });

        it('formulaire non valide car emails non egaux', () => {
            // WHEN
            createAccountForm.get('emailGroup').get('emailConfirm').setValue('email2@gmail.com');

            // THEN
            expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
            expect(createAccountForm?.valid).toBeFalse();
            expect(createAccountForm?.get('emailGroup')?.errors?.['emailGroupNotEqual']).toBeTrue();
        });

        it('formulaire non valide car email 1 pas au format email', () => {
            // WHEN
            const createAccountForm = fixture.componentInstance.createAccountForm;
            createAccountForm.get('emailGroup').get('email').setValue('email.com');

            // THEN
            expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
            expect(createAccountForm?.valid).toBeFalse();
        });

        describe('test champ non rempli', () => {
            it('formulaire non valide car login non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('login').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car prenom non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('prenom').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car nom non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('nom').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car password non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('password').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car email 1 non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('emailGroup').get('email').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
                expect(createAccountForm?.valid).toBeFalse();
                expect(createAccountForm?.get('emailGroup')?.errors?.['emailGroupNotEqual']).toBeTrue();
            });
    
            it('formulaire non valide car email 2 non rempli', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('emailGroup').get('emailConfirm').setValue('');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
                expect(createAccountForm?.valid).toBeFalse();
                expect(createAccountForm?.get('emailGroup')?.errors?.['emailGroupNotEqual']).toBeTrue();
            });
        });

        describe('test champ trop petit', () => {
            it('formulaire non valide car login trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('login').setValue('lo');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car prenom trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('prenom').setValue('pr');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car nom trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('nom').setValue('no');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car password trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('password').setValue('pa');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeTrue();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car email 1 trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('emailGroup').get('email').setValue('em');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
                expect(createAccountForm?.valid).toBeFalse();
            });
    
            it('formulaire non valide car email 2 trop petit', () => {
                // WHEN
                const createAccountForm = fixture.componentInstance.createAccountForm;
                createAccountForm.get('emailGroup').get('emailConfirm').setValue('em');
    
                // THEN
                expect(createAccountForm?.get('emailGroup').valid).toBeFalse();
                expect(createAccountForm?.valid).toBeFalse();
            });
        });
    });
});
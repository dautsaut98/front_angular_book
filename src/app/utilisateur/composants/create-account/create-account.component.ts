import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionUtilisateurService } from '../../services/gestion-utilisateur.service';
import { Router } from '@angular/router';


function validatorEmailGroup(abstractControl: AbstractControl): { [key: string]: boolean } | null {
  return (abstractControl.get('email')?.value != abstractControl.get('emailConfirm')?.value) ? { emailGroupNotEqual: true }: null;
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit{
  createAccountForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router){}

  ngOnInit(): void {
    this.createAccountForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      emailGroup: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', Validators.required],
      }, {validator: validatorEmailGroup}),
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  register(){
    const login: string = this.createAccountForm.get('login')?.value;
    const prenom: string = this.createAccountForm.get('prenom')?.value;
    const nom: string = this.createAccountForm.get('nom')?.value;
    const email: string = this.createAccountForm.get('email')?.value;
    const password: string = this.createAccountForm.get('password')?.value;

    this.gestionUtilisateurService.register({id:0, login: login, prenom: prenom, nom: nom, password: password, email: email}).subscribe({
      next: utilisateur => utilisateur? this.router.navigate(["/libraire"]): this.createAccountForm.setErrors({ loginEmailUse: true }),
      error: () => this.createAccountForm.setErrors({ connectionServeur: true }),
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GestionUtilisateurService } from '../../services/gestion-utilisateur.service';
import { Router } from '@angular/router';
import { globalVariables } from 'src/app/utils/app.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  public backgroundPath = globalVariables.BACKGROUND_SIGNUP_CONNEXION_PATH;

  constructor(private formBuilder: FormBuilder,
    private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  login(): void {
    const login: string = this.loginForm.get('login')?.value;
    const password: string = this.loginForm.get('password')?.value;

    this.gestionUtilisateurService.connect(login, password).subscribe({
      next: () => this.router.navigate(["/libraire"]),
      error: () => this.loginForm.setErrors({ connectionServeur: true }),
    });
  }
}

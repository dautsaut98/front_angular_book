import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GestionUtilisateurService } from '../../services/gestion-utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void{
    const login: string = this.loginForm.get('login')?.value;
    const password: string = this.loginForm.get('password')?.value;

    this.gestionUtilisateurService.connect(login, password).subscribe({
      next: utilisateur => utilisateur? this.router.navigate(["/libraire"]): this.loginForm.setErrors({ connection: true }),
      error: () => this.loginForm.setErrors({ connectionServeur: true }),
    });
  }
}

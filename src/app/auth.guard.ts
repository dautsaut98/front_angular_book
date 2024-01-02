import { CanActivate, Router } from '@angular/router';
import { GestionUtilisateurService } from './utilisateur/services/gestion-utilisateur.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router) {}

  canActivate(): boolean {
    this.gestionUtilisateurService.utilisateur$.subscribe({
      next: utilisateur => {
        if(!utilisateur){
          this.router.navigate(["/login"]);
          return false;
        }
        return true;
      },
    });
    return true;
  }
}
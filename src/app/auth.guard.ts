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
    let valeurUtilisateur = this.gestionUtilisateurService.utilisateurSubject.getValue();
    if(!valeurUtilisateur){
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
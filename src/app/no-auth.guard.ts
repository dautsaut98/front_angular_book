import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { GestionUtilisateurService } from "./utilisateur/services/gestion-utilisateur.service";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router
  ) {}

  canActivate(): boolean { 
    let valeurUtilisateur = this.gestionUtilisateurService.utilisateurSubject.getValue();
    if(valeurUtilisateur){
      this.router.navigate(['/librairie']);
      return false;
    }
    return true;
  }
}
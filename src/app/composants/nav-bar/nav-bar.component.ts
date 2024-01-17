import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(public gestionUtilisateurService: GestionUtilisateurService,
    private router: Router) { }

  /**
   * Deconnecte l'utilisateur.
   */
  disconnect(): void {
    this.gestionUtilisateurService.disconnect();
    this.router.navigate(["/login"]);
  }
}

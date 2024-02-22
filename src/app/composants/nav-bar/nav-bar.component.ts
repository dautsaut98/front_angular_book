import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GestionBookService } from 'src/app/book/services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  searchTerm: string = '';
  listeBookFind: Book[] = [];


  constructor(public gestionUtilisateurService: GestionUtilisateurService,
    private gestionBookService: GestionBookService,
    private router: Router) { }

  /**
   * Deconnecte l'utilisateur.
   */
  disconnect(): void {
    this.gestionUtilisateurService.disconnect();
    this.router.navigate(["/login"]);
  }

  /**
   * Gere la barre de recherche
   */
  search() {
    this.listeBookFind = this.searchTerm === '' ? [] : this.gestionBookService.books.filter(book => book.nom.toLowerCase().startsWith(this.searchTerm.toLowerCase()));
  }
}

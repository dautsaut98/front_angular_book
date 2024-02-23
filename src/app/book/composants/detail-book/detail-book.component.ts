import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GestionBookService } from '../../services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { globalVariables } from 'src/app/utils/app.config';

@Component({
  selector: 'app-detail-book',
  templateUrl: './detail-book.component.html',
  styleUrls: ['./detail-book.component.scss']
})
export class DetailBookComponent implements OnInit {
  public book: Book;
  urlImagePrevisualisation: string = globalVariables.IMAGE_DEFAULT_PATH;

  constructor(private route: ActivatedRoute,
    private gestionBookService: GestionBookService) { }

  ngOnInit(): void {
    // On initialise le livre à null.
    this.book = null;
    // On récupère l'id du livre depuis la route.
    this.route.paramMap.subscribe(params => {
      const bookIdNumber = Number.parseInt(params.get('idLivre'));
      if(!isNaN(bookIdNumber)) {
        this.book = this.gestionBookService.books.find(book => book.id === bookIdNumber);
      }
    });
  }

  /**
   * Permet si l'image de prévisualisation ne s'affiche pas de la changer par une image par defaut.
   */
  handleImageError() {
    this.urlImagePrevisualisation = globalVariables.IMAGE_DEFAULT_PATH;
  }

  /**
   * Permet de déterminer si le livre est affichable.
   * @returns false si non affichable
   */
  determineIsAffichable(): boolean {
    if(!this.book){
      return false;
    }

    if(this.book.srcImage || this.book.srcImage != ""){
      this.urlImagePrevisualisation = this.book.srcImage;
    }

    if(!this.book.nom){
      return false;
    }

    if(!this.book.description){
      return false;
    }

    if(!this.book.dateParution){
      return false;
    }
    // Mise en forme de la date.
    const date = new Date(this.book.dateParution);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    this.book.dateParution =  date.toLocaleDateString('fr-FR', options);

    return true;
  }
}

import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { globalVariables } from 'src/app/utils/app.config';

@Component({
  selector: 'item-list-book',
  templateUrl: './item-list-book.component.html',
  styleUrls: ['./item-list-book.component.scss']
})
export class ItemListBookComponent {
  @Input()
  book!: Book;

  private pathImageBookParDefault = globalVariables.IMAGE_DEFAULT_PATH;

  handleImageError(event: any, book: any) {
    // Charger une image de remplacement si l'image principale ne se charge pas
    this.book.srcImage = this.pathImageBookParDefault;
  }

  determineIsAffichable(): boolean {
    if(!this.book){
      return false;
    }

    if(!this.book.srcImage || this.book.srcImage === ""){
      this.book.srcImage = this.pathImageBookParDefault;
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

    return true;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }
}

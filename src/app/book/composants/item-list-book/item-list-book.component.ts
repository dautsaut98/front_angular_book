import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'item-list-book',
  templateUrl: './item-list-book.component.html',
  styleUrls: ['./item-list-book.component.scss']
})
export class ItemListBookComponent {
  @Input()
  book!: Book;

  private static urlImageBookParDefault = "https://img.freepik.com/free-photo/red-hardcover-book-front-cover_1101-833.jpg";

  handleImageError(event: any, book: any) {
    // Charger une image de remplacement si l'image principale ne se charge pas
    this.book.srcImage = ItemListBookComponent.urlImageBookParDefault;
  }

  determineIsAffichable(): boolean {
    if(!this.book){
      return false;
    }

    if(!this.book.srcImage || this.book.srcImage === ""){
      this.book.srcImage = ItemListBookComponent.urlImageBookParDefault;
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
}

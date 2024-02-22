import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { globalVariables } from 'src/app/utils/app.config';

@Component({
  selector: 'item-list-search-book',
  templateUrl: './item-list-search-book.component.html',
  styleUrls: ['./item-list-search-book.component.scss']
})
export class ItemListSearchBookComponent implements OnInit {
  @Input()
  book: Book;

  pathImageBook: string;

  ngOnInit(): void {
    this.pathImageBook = this.book.srcImage;
  }

  /**
   * Correction si l'image ne charge pas.
   * @param event 
   * @param book 
   */
  handleImageError() {
    // Charger une image de remplacement si l'image principale ne se charge pas
    this.pathImageBook = globalVariables.IMAGE_DEFAULT_PATH;
  }
}

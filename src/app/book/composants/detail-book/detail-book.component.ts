import { Component, Input } from '@angular/core';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-detail-book',
  templateUrl: './detail-book.component.html',
  styleUrls: ['./detail-book.component.scss']
})
export class DetailBookComponent {
  @Input()
  book!: Book;

  ngOnChanges() {
  }

  determineIsAffichable(): boolean {
    if(!this.book){
      return false;
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

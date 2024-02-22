import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, first, tap } from 'rxjs';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';
import { globalVariables } from 'src/app/utils/app.config';

@Injectable({
  providedIn: 'root'
})
export class GestionBookService {
  books: Book[] = []; 
  idUser: number = null;

  constructor(private http: HttpClient, private gestionUtilisateurService: GestionUtilisateurService) {
    this.gestionUtilisateurService.utilisateur$.subscribe(utilisateur => this.idUser = utilisateur?.id);
  }

  /**
   * Ajoute un livre.
   * @param bookAdd 
   */
  addBook(bookAdd: Book): Observable<Book> {
    bookAdd.idUser = this.idUser;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Book>(`${globalVariables.URL_BOOK}/addBook`, bookAdd, { headers })
      .pipe(
        first(),
        tap({
          error: err => console.error(err)
        }));
  }

  /**
   * On retourne la liste des livres pour un utilisateur.
   * @param idUtilisateur 
   * @returns 
   */
  getBooks(): Observable<Book[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Book[]>(`${globalVariables.URL_BOOK}/all?idUser=${this.idUser}`, { headers })
      .pipe(
        first(),
        tap({
          next: (books: Book[]) => {
            console.info(JSON.stringify(books));
            this.books = books;
          },
          error: error => console.error(error)
        }));
  }
}

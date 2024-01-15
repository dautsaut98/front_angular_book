import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, first, tap } from 'rxjs';
import { Book } from 'src/app/models/book';

@Injectable({
  providedIn: 'root'
})
export class GestionBookService implements OnInit, OnDestroy {
  books!: Book[];
  book?: Book;
  idUser: number = null;

  private urlBack = "http://localhost:8080/book";

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.subscriptions = [];
  }

  /**
   * Ajoute un livre.
   * @param bookAdd 
   */
  addBook(bookAdd: Book): Observable<Book> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    bookAdd.id = null;
    bookAdd.idUser = this.idUser;

    return this.http.post<Book>(this.urlBack, bookAdd, { headers })
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
  getBooks(idUser: number): Observable<Book[]> {
    this.idUser = idUser ?? null;

    const queryParams = new HttpParams().append("idUser", this.idUser);
    return this.http.get<Book[]>(this.urlBack, { params: queryParams })
      .pipe(
        first(),
        tap({
          next: books => {
            console.info(JSON.stringify(books));
            this.books = books;
          },
          error: error => console.error(error)
        }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}

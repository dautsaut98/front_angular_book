import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class GestionBookService implements OnInit, OnDestroy {
  private books!: Book[];
  book?: Book;
  idUser: number = null;

  private urlBack = "http://localhost:4200/api/books";

  private subscriptions: Subscription[] = [];

  constructor(private gestionUtilisateurService: GestionUtilisateurService,
    private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.subscriptions = [];
  }

  /**
   * Ajoute un livre.
   * @param bookAdd 
   */
  addBook(bookAdd: Book) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    bookAdd.id = null;
    bookAdd.idUtilisateur = this.idUser;
    let subscribePostBook = this.http.post<Book>(this.urlBack, bookAdd, { headers })
      .pipe(tap(data => console.log('createProduct: ' + JSON.stringify(data))))
      .subscribe({
        next: book => console.error(`add book : ${book}`),
        error: err => console.error(err)});
    this.subscriptions.push(subscribePostBook);
    this.router.navigate(['/libraire']);
  }

  /**
   * Supprime un livre.
   * @param idBook 
   */
  deleteBook(idBook: number){
    this.books = this.books.filter(bookFilter => bookFilter.id != idBook);
  }

  /**
   * On retourne la liste des livres pour un utilisateur.
   * @param idUtilisateur 
   * @returns 
   */
  getBooks(): Book[]{
    this.idUser = this.gestionUtilisateurService.utilisateurSubject.getValue()?.id ?? null;
    let subscribeGetBooks = this.http.get<Book[]>(this.urlBack)
      .pipe(tap(utilisateur => console.log(JSON.stringify(utilisateur))))
      .subscribe({
        next: books => this.books = books.filter(book => book.idUtilisateur === this.idUser) ?? [],
        error: err => console.error(err)});
    this.subscriptions.push(subscribeGetBooks);
    return this.books;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}

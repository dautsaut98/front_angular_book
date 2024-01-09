import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, first, tap } from 'rxjs';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class GestionBookService implements OnInit, OnDestroy {
  private books!: Book[];
  book?: Book;
  idUser: number = null;

  private urlBack = "http://localhost:8080/book";

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
    bookAdd.idUser = this.idUser;

    const subscribePostBook = this.http.post<Book>(this.urlBack, bookAdd, { headers })
      .pipe(
        first(),
        tap(data => console.log('createProduct: ' + JSON.stringify(data))))
      .subscribe({
        next: () => this.router.navigate(['/libraire']),
        error: err => console.error(err)});
    this.subscriptions.push(subscribePostBook);
  }

  /**
   * On retourne la liste des livres pour un utilisateur.
   * @param idUtilisateur 
   * @returns 
   */
  getBooks(): Book[] {
    this.books = [];
    const subscribeGetUtilisateur = this.gestionUtilisateurService.utilisateur$.subscribe({
      next: user => {
        this.idUser = user?.id ?? null;

        const queryParams = new HttpParams().append("idUser",this.idUser);
        const subscribeGetBooks = this.http.get<Book[]>(this.urlBack, {params:queryParams})
          .pipe(
            first(),
            tap(utilisateur => console.log(JSON.stringify(utilisateur))))
          .subscribe({
            next: books => this.books = books,
            error: err => console.error(err)});
        this.subscriptions.push(subscribeGetBooks);
      }
    });
    this.subscriptions.push(subscribeGetUtilisateur);

    return this.books;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}

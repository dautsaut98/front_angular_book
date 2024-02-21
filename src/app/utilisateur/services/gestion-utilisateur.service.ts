import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, first, of, switchMap, tap, throwError, timeout } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur';
import { globalVariables } from 'src/app/utils/app.config';


@Injectable({
  providedIn: 'root'
})
export class GestionUtilisateurService {

  private utilisateurSubject: BehaviorSubject<Utilisateur | null> = new BehaviorSubject<Utilisateur | null>(null);
  utilisateur$: Observable<Utilisateur | null> = this.utilisateurSubject.asObservable();

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Retourne true si on a trouvé et connecté l'utilisateur.
   * @param login 
   * @param password 
   * @returns 
   */
  connect(login: string, password: string): Observable<Utilisateur> {
    // On reset.
    this.utilisateurSubject.next(null);
    localStorage.removeItem('token');

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(globalVariables.URL_CONNEXION, {login: login, password: password}, { headers })
      .pipe(
        // On récupère le token si la connexion est correct.
        switchMap((newToken: any) => {
          // On met le token en session.
          localStorage.setItem('token', newToken.accessToken);
          // On récupère l'utilisateur.
          return this.getUtilisateur(login);
        }),
        // sinon on remonte une erreur
        catchError(error => {return throwError(() => error);})
    );
  }

  /**
   * On ajoute un utilisateur et retourne l'utilisateur courant.
   * @param utilisateur
   */
  inscription(utilisateur: Utilisateur): Observable<Utilisateur> {
    this.utilisateurSubject.next(null);
    localStorage.removeItem('token');
    // On ajoute le nouvel utilisateur.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(globalVariables.URL_INSCRIPTION, utilisateur, { headers })
      .pipe(
        // On récupère le token si la connexion est correct.
        switchMap((newToken: any) => {
          // On met le token en session.
          localStorage.setItem('token', newToken.accessToken);
          // On récupère l'utilisateur.
          return this.getUtilisateur(utilisateur.login);
        }),
        // sinon on remonte une erreur
        catchError(error => {return throwError(() => error);})
      );
  }

  /**
   * Log l'erreur et la met dans le utilisateurSubject.
   * @param error 
   */
  gestionErreurUtilisateur(error: any): void {
    console.error(error);
    this.utilisateurSubject.error(error);
  }

  /**
   * Retourne l'utilisateur connecté.
   */
  disconnect(): void {
    this.utilisateurSubject.next(null);

    // On enleve le token.
    localStorage.removeItem('token');
  }

  /**
   * Méthode pour mettre à jour la propriété privée (utilisée uniquement pour les tests).
   * @param user 
   */
  updateUtilisateurSubject(user: Utilisateur): void {
    this.utilisateurSubject.next(user);
  }

  /**
   * retourne l'utilisateur
   */
  getUtilisateur(login: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${globalVariables.URL_UTILISATEUR}/${login}`)
      .pipe(
        first(),
        tap({
          next: utilisateur => {
            this.utilisateurSubject.next(utilisateur);
            console.info(JSON.stringify(utilisateur));
          },
          error: error => this.gestionErreurUtilisateur(error),
          finalize: () => { return this.utilisateurSubject.asObservable(); }
        })
      );
  }
}
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, first, of, switchMap, tap, throwError, timeout } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class GestionUtilisateurService implements OnInit, OnDestroy {

  private utilisateurSubject: BehaviorSubject<Utilisateur | null> = new BehaviorSubject<Utilisateur | null>(null);
  utilisateur$: Observable<Utilisateur | null> = this.utilisateurSubject.asObservable();

  private static urlInscription = "http://localhost:8080/inscription";

  private static urlConnexion = "http://localhost:8080/connexion";

  private static urlUtilisateur = "http://localhost:8080/utilisateur";

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.subscriptions = [];
  }

  /**
   * Retourne true si on a trouvé et connecté l'utilisateur.
   * @param login 
   * @param password 
   * @returns 
   */
  connect(login: string, password: string): Observable<Utilisateur> {
    // On reset.
    this.utilisateurSubject.next(null);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(GestionUtilisateurService.urlConnexion, {login: login, password: password}, { headers })
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
    // On ajoute le nouvel utilisateur.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(GestionUtilisateurService.urlInscription, utilisateur, { headers })
      .pipe(
        // On récupère le token si l'inscription est correct.
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
    return this.http.get<Utilisateur>(GestionUtilisateurService.urlUtilisateur+"/"+login)
      .pipe(
        first(),
        tap({
          next: utilisateur => {
            this.utilisateurSubject.next(utilisateur ?? null);
            console.info(JSON.stringify(utilisateur));
          },
          error: error => {
            console.error(error);
            this.gestionErreurUtilisateur(error);
          },
          finalize: () => { return this.utilisateurSubject.asObservable(); }
        })
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}
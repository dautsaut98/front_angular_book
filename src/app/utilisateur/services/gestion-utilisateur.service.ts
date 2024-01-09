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

  private urlBack = "http://localhost:8080/utilisateur";

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
  connect(login: string, password: string): Observable<Utilisateur | null>{
    // On reset.
    this.utilisateurSubject.next(null);

    return this.getUtilisateur(login, password).pipe(
      switchMap((utilisateur: Utilisateur) => {
        this.utilisateurSubject.next(utilisateur ?? null)
        return this.utilisateurSubject.asObservable();
      }),
      catchError((error: any) => {
        this.gestionErreurUtilisateur(error);
        return this.utilisateurSubject.asObservable();
      })
    );
  }

  /**
   * On ajoute un utilisateur et retourne l'utilisateur courant.
   * @param utilisateur
   */
  addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur | null>{
    this.utilisateurSubject.next(null);
    // On ajoute le nouvel utilisateur.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Utilisateur>(this.urlBack, utilisateur, { headers })
      .pipe(
        first(),
        tap({
          next: utilisateurRetour => {
            console.info(JSON.stringify(utilisateurRetour));
            this.utilisateurSubject.next(utilisateurRetour);
          },
          error: error => console.error(error)
        }));
  }

  /**
   * Log l'erreur et la met dans le utilisateurSubject.
   * @param error 
   */
  gestionErreurUtilisateur(error: any){
    console.error(error);
    this.utilisateurSubject.error(error);
  }

  /**
   * Retourne l'utilisateur connecté.
   */
  disconnect(){
    this.utilisateurSubject.next(null);
  }

  /**
   * Méthode pour mettre à jour la propriété privée (utilisée uniquement pour les tests).
   * @param user 
   */
  updateUtilisateurSubject(user: Utilisateur | null): void {
    this.utilisateurSubject.next(user);
  }

  /**
   * retourne l'utilisateur
   */
  getUtilisateur(login: string, password: string): Observable<Utilisateur>{
    const queryParams = new HttpParams().append("login",login).append("password",password);

    return this.http.get<Utilisateur>(this.urlBack,{params:queryParams})
      .pipe(
        first(),
        tap({
          next: utilisateur => console.info(JSON.stringify(utilisateur)),
          error: error => console.error(error)
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}
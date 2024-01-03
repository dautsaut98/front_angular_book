import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, of, switchMap, tap, throwError, timeout } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class GestionUtilisateurService implements OnInit, OnDestroy {

  private utilisateurSubject: BehaviorSubject<Utilisateur | null> = new BehaviorSubject<Utilisateur | null>(null);
  utilisateur$: Observable<Utilisateur | null> = this.utilisateurSubject.asObservable();

  private urlBack = "http://localhost:4200/api/utilisateurs";

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

    return this.getUtilisateurs().pipe(
      switchMap((utilisateurs: Utilisateur[]) => {
        this.utilisateurSubject.next(utilisateurs.find(utilisateurFilter => utilisateurFilter.login === login && utilisateurFilter.password === password) ?? null);
        return this.utilisateurSubject.asObservable();
      }),
      catchError((error: any) => {
        this.gestionErreurUtilisateur(error);
        return this.utilisateurSubject.asObservable();
      })
    );
  }

  /**
   * Retourne l'utilisateur courant.
   * @param login 
   * @param password 
   * @returns 
   */
  register(utilisateur: Utilisateur): Observable<Utilisateur | null>{
    // On récupère la liste des utilisateurs.
    const subscribeGetUtilisateurs =  this.getUtilisateurs()
      .subscribe({
        next: (utilisateurs: Utilisateur[]) => {
          // Si jamais le login ou le mot de passe existe déjà on met une erreur
          if(utilisateurs.find(utilisateurFilter => utilisateurFilter.login === utilisateur.login || utilisateurFilter.email === utilisateur.email)){
            this.gestionErreurUtilisateur(new Error('login ou password déjà existant'));
          }
          else {
            // On ajoute le nouvel utilisateur.
            this.addUtilisateur(utilisateur);
          }
        },
        error: err => this.gestionErreurUtilisateur(err)});
    this.subscriptions.push(subscribeGetUtilisateurs);

    return this.utilisateur$!;
  }

  /**
   * On ajoute un utilisateur.
   * @param utilisateur
   */
  addUtilisateur(utilisateur: Utilisateur){
    // On ajoute le nouvel utilisateur.
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    utilisateur.id = null;
    const subscribePostUtilisateur = this.http.post<Utilisateur>(this.urlBack, utilisateur, { headers })
      .pipe(tap(data => console.log('createProduct: ' + JSON.stringify(data))))
      .subscribe({
        next: utilisateur => this.utilisateurSubject.next(utilisateur ?? null),
        error: err => this.gestionErreurUtilisateur(err)});
    this.subscriptions.push(subscribePostUtilisateur);
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
   * retourne la liste des utilisateurs
   */
  getUtilisateurs(): Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(this.urlBack)
      .pipe(tap({
        next: utilisateur => console.info(JSON.stringify(utilisateur)),
        error: error => console.error(error)
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}
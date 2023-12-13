import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap, timeout } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class GestionUtilisateurService implements OnInit, OnDestroy {

  utilisateurSubject: BehaviorSubject<Utilisateur | null> = new BehaviorSubject<Utilisateur | null>(null);
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
    let subscribeGetUtilisateurs =  this.getUtilisateurs()
    .subscribe({
      next: (utilisateurs: Utilisateur[]) => this.utilisateurSubject.next(utilisateurs.find(utilisateurFilter => utilisateurFilter.login === login && utilisateurFilter.password === password) ?? null),
      error: err => console.error(err)});
    this.subscriptions.push(subscribeGetUtilisateurs);
    return this.utilisateur$!;
  }

  /**
   * Retourne true si on a trouvé et connecté l'utilisateur.
   * @param login 
   * @param password 
   * @returns 
   */
  register(utilisateur: Utilisateur): Observable<Utilisateur | null>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    utilisateur.id = null;
    let subscribePostUtilisateur = this.http.post<Utilisateur>(this.urlBack, utilisateur, { headers })
      .pipe(tap(data => console.log('createProduct: ' + JSON.stringify(data))))
      .subscribe({
        next: utilisateur => this.utilisateurSubject.next(utilisateur ?? null),
        error: err => console.error(err)});
    this.subscriptions.push(subscribePostUtilisateur);

    return this.utilisateur$!;
  }

  /**
   * Retourne l'utilisateur connecté.
   */
  disconnect(){
    this.utilisateurSubject.next(null);
  }

  /**
   * retourne la liste des utilisateurs
   */
  getUtilisateurs(): Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(this.urlBack)
      .pipe(tap(utilisateur => console.info(JSON.stringify(utilisateur))));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }
}
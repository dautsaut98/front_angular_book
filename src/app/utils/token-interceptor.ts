import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Récupérer le jeton d'authentification depuis le stockage local (localStorage, sessionStorage, etc.)
        const authToken = localStorage.getItem('token');

        // Ajouter le jeton d'authentification à l'en-tête Authorization de la requête sortante
        if (authToken) {
            request = request.clone({
                setHeaders: {
                Authorization: `Bearer ${authToken}`,
                },
            });
        }

        // Passer la requête modifiée au prochain intercepteur ou au gestionnaire de requêtes
        return next.handle(request);
    }
}
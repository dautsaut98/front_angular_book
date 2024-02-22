import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookModule } from './book/book.module';
import { NavBarComponent } from './composants/nav-bar/nav-bar.component';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { TokenInterceptor } from './utils/token-interceptor';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemListSearchBookComponent } from './utilisateur/composants/item-list-search-book/item-list-search-book.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ItemListSearchBookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    // Composants interne
    UtilisateurModule,
    RouterModule,
    BookModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }

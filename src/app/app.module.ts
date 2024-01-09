import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookModule } from './book/book.module';
import { NavBarComponent } from './composants/nav-bar/nav-bar.component';
import { UtilisateurModule } from './utilisateur/utilisateur.module';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // Composants interne
    UtilisateurModule,
    BookModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

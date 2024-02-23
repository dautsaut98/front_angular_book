import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AddBookComponent } from './composants/add-book/add-book.component';
import { ItemListBookComponent } from './composants/item-list-book/item-list-book.component';
import { LibrairieUtilisateurComponent } from './composants/librairie-utilisateur/librairie-utilisateur.component';
import { AppRoutingModule } from '../app-routing.module';
import { DetailBookComponent } from './composants/detail-book/detail-book.component';
import { UpdateBookComponent } from './composants/update-book/update-book.component';


@NgModule({
  declarations: [
    LibrairieUtilisateurComponent,
    ItemListBookComponent,
    AddBookComponent,
    DetailBookComponent,
    UpdateBookComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  exports: [ItemListBookComponent]
})
export class BookModule { }

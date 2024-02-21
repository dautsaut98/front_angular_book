import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AddBookComponent } from './composants/add-book/add-book.component';
import { ItemListBookComponent } from './composants/item-list-book/item-list-book.component';
import { EditBookComponent } from './composants/edit-book/edit-book.component';
import { LibrairieUtilisateurComponent } from './composants/librairie-utilisateur/librairie-utilisateur.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    LibrairieUtilisateurComponent,
    ItemListBookComponent,
    EditBookComponent,
    AddBookComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: []
})
export class BookModule { }

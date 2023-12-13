import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AddBookComponent } from './composants/add-book/add-book.component';
import { DetailBookComponent } from './composants/detail-book/detail-book.component';
import { EditBookComponent } from './composants/edit-book/edit-book.component';
import { LibrairieUtilisateurComponent } from './composants/librairie-utilisateur/librairie-utilisateur.component';


@NgModule({
  declarations: [
    LibrairieUtilisateurComponent,
    DetailBookComponent,
    EditBookComponent,
    AddBookComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class BookModule { }

import { NgModule } from '@angular/core';
import { LoginComponent } from './composants/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponent } from './composants/create-account/create-account.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent,
    CreateAccountComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: []
})
export class UtilisateurModule { }

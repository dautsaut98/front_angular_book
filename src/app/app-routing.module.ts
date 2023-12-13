import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './utilisateur/composants/login/login.component';
import { CreateAccountComponent } from './utilisateur/composants/create-account/create-account.component';
import { LibrairieUtilisateurComponent } from './book/composants/librairie-utilisateur/librairie-utilisateur.component';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';import { AddBookComponent } from './book/composants/add-book/add-book.component';
;

const routes: Routes = [
  {path:'', redirectTo: '/login', pathMatch:'full'},
  {path:'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  {path:'createAccount', component: CreateAccountComponent, canActivate: [NoAuthGuard]},
  {path:'libraire', component: LibrairieUtilisateurComponent, canActivate: [AuthGuard]},
  {path:'addBook', component: AddBookComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

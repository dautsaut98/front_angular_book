import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionBookService } from '../../services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { globalVariables } from 'src/app/utils/app.config';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private gestionBookService: GestionBookService, private router: Router) { }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      books: this.formBuilder.array([this.buildBook()])
    });
  }

  buildBook(): FormGroup {
    return this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      srcImage: [''],
      dateParution: ['', [Validators.required]],
      lu: [false, [Validators.required]],
      prenomAuteur: ['', [Validators.required, Validators.minLength(3)]],
      nomAuteur: ['', [Validators.required, Validators.minLength(3)]],
      // Pour l'affichage de l'image de prévisualisation.
      urlImagePrevisualisation: [globalVariables.IMAGE_DEFAULT_PATH],
    });
  }

  /**
   * Retourne la liste des books pour l'html.
   */
  get books(): FormArray {
    return <FormArray>this.bookForm.get('books');
  }

  /**
   * Ajoute un livre.
   */
  addFormBook() {
    this.books.push(this.buildBook());
  }

  /**
   * Supprime un livre.
   */
  deleteFormBook(index: number) {
    this.books.removeAt(index);
  }

  /**
   * Recupere l'index du formulaire en fonction du nom du livre.
   * @param nomLivre Le nom du livre d'où on veut récupérer le formulaire.
   * @returns l'index du formulaire
   */
  searchIndexFormBook(nomLivre: string): number {
    return this.books.controls.findIndex(form => form.get('nom')?.value === nomLivre)
  }

  /**
   * Ajoute un/des livre(s).
   */
  addBook() {
    // Si isBookFind est true alors on n'ajoute aucun livre.
    if(this.isDoublonsInListeAddBook()){
      return;
    }

    // On transforme la liste de livre control en liste de scubscribe.
    const addBookObservables = this.books.controls.map(bookControl => this.gestionBookService.addBook(this.transformFormInBook(bookControl)));

    forkJoin(addBookObservables).subscribe({
      // Tous les appels ont été réussis.
      next: () => this.router.navigate(['/libraire']),
       // On supprime tous les livres qui ont été ajoutés. Puis on rajoute à celui en erreur un message.
      error: errorResponse => {
        this.books.controls.splice(0, this.searchIndexFormBook(errorResponse.error));
        this.books.controls.at(0)?.setErrors(this.gestionErreurAddBook(errorResponse.status));
      }
    });
  }

  /**
   * Si il y a un doublons dans la liste des livres à ajouter.
   * @returns true si il y a un doublons dans la liste des livres à ajouter
   */
  isDoublonsInListeAddBook(): boolean{
    // Si la liste des livres est null on retourne false
    if(!this.gestionBookService.books) {
      return false;
    }
    // Liste des noms des livres Ajoutés.
    const listeLivreAddName: string[] = this.books.controls.map(formControl => formControl.get('nom')?.value);

    // Si le livre existe déjà on affiche l'erreur et on enregistre pas.
    let isBookFind: boolean = false;
    this.books.controls.forEach(book => {
      const nameLivreAdd = book.get('nom')?.value;
  
      // Si le livre existe dejà dans la liste des livres de l'utilisateur
      // Ou si dans la liste des livres à ajouter on à deux fois le même nom
      // Alors on met un message d'erreur sur le livre en question
      // Et on met isBookFind à true.
      if(this.gestionBookService.books.find(bookElement => bookElement.nom === nameLivreAdd) != undefined
        || listeLivreAddName.indexOf(nameLivreAdd) != listeLivreAddName.lastIndexOf(nameLivreAdd)) {
        book.setErrors({ bookDejaExistant: true });
        // On veut pas que ça s'arrete la car on a pas fait toute le liste pour afficher les erreurs si il y en a donc on ne fait pas un return true.
        isBookFind = true;
      }
    });
    return isBookFind;
  }

  /**
   * Gestion de l'erreur lors de l'ajout d'un livre.
   * @param statutErreur 
   */
  gestionErreurAddBook(statutErreur: number): Record<string, boolean> {
    switch (statutErreur) {
      case 409:
        return { bookDejaExistant: true };
      case 404:
        return { UtilisateurNotFound: true };
      case 500:
      default :
        return { erreurLorsDeLEnregistrement: true };
    }
  }

  /**
   * Transforme un formulaire en book.
   * @param form à transformer
   */
  transformFormInBook(form: AbstractControl): Book{
    const nom: string = form.get('nom')?.value;
    const description: string = form.get('description')?.value;
    const dateParution: string = form.get('dateParution')?.value;
    const lu: boolean = !!(form.get('lu')?.value ?? false);
    const prenomAuteur: string = form.get('prenomAuteur')?.value;
    const nomAuteur: string = form.get('nomAuteur')?.value;
    const srcImage: string = form.get('srcImage')?.value ?? '';
    return {id: -1, idUser: -1, nom: nom, prenomAuteur: prenomAuteur, nomAuteur: nomAuteur, description: description, dateParution: dateParution, lu: lu, srcImage: srcImage}
  }

  /**
   * Permet si l'image de prévisualisation ne s'affiche pas de la changer par une image par defaut.
   * @param index du livre où est l'erreur
   */
  handleImageError(index: number) {
    this.books.at(index)?.get('urlImagePrevisualisation')?.setValue(globalVariables.IMAGE_DEFAULT_PATH);
  }

  /**
   * Quand l'input de l'url est change on change celui de urlImagePrevisualisation
   * @param index du livre où l'url a changé
   */
  urlImageChange(index: number) {
    this.books.at(index)?.get('urlImagePrevisualisation')?.setValue(this.books.at(index)?.get('srcImage')?.value);
  }

  /**
   * Permet de récupérer urlImagePrevisualisation
   * @param index du livre où on veut récupérer urlImagePrevisualisation
   */
  getUrlImagePrevisualisation(index: number): string {
    return this.books.at(index)?.get('urlImagePrevisualisation')?.value;
  }
}
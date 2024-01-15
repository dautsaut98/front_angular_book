import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionBookService } from '../../services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { Router } from '@angular/router';

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
      dateParution: ['', [Validators.required, Validators.minLength(3)]],
      lu: [false],
      prenomAuteur: ['', [Validators.required, Validators.minLength(3)]],
      nomAuteur: ['', [Validators.required, Validators.minLength(3)]],
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
   * Ajoute un/des livre(s).
   */
  addBook() {
    // Si isBookFind est true alors on ajoute aucun livre.
    if(this.isDoublonsInListeAddBook()){
      return;
    }

    // On enregistre les livres 1 par un.
    this.books.controls.map(bookControl => {
      const bookAdd = this.transformFormInBook(bookControl);

      this.gestionBookService.addBook(bookAdd).subscribe({
        next: () => this.router.navigate(['/libraire']),
        error: error => bookControl.setErrors(this.gestionErreurAddBook(error.status))
      });
    });
  }

  /**
   * Si il y a un doublons dans la liste des livres à ajouter.
   * @returns true si il y a un doublons dans la liste des livres à ajouter
   */
  isDoublonsInListeAddBook(): boolean{
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
    return {id: -1, idUser: -1, nom: nom, prenomAuteur: prenomAuteur, nomAuteur: nomAuteur, description: description, dateParution: dateParution, lu: lu};
  }
}
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { globalVariables } from 'src/app/utils/app.config';
import { GestionBookService } from '../../services/gestion-book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.scss']
})
export class UpdateBookComponent implements OnInit{
  book: Book;
  bookForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private gestionBookService: GestionBookService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    // On initialise le livre à null.
    this.book = null;
    // On récupère l'id du livre depuis la route.
    this.route.paramMap.subscribe(params => {
      const bookIdNumber = Number.parseInt(params.get('idLivre'));
      if(!isNaN(bookIdNumber)) {
        this.book = this.gestionBookService.books.find(book => book.id === bookIdNumber);
      }
    });

    // Mise en forme de la date.
    const date = new Date(this.book.dateParution);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    this.book.dateParution =  date.toLocaleDateString('fr-FR', options).split('/').reverse().join('-');

    this.bookForm = this.formBuilder.group({
      nom: [this.book.nom, [Validators.required, Validators.minLength(3)]],
      description: [this.book.description, [Validators.required, Validators.minLength(3)]],
      srcImage: [this.book.srcImage ?? ''],
      dateParution: [this.book.dateParution, [Validators.required]],
      lu: [this.book.lu, [Validators.required]],
      prenomAuteur: [this.book.prenomAuteur, [Validators.required, Validators.minLength(3)]],
      nomAuteur: [this.book.nomAuteur, [Validators.required, Validators.minLength(3)]],
      // Pour l'affichage de l'image de prévisualisation.
      urlImagePrevisualisation: [this.book.srcImage],
    });
  }

  /**
   * Quand l'input de l'url est change on change celui de urlImagePrevisualisation
   */
  urlImageChange() {
    this.bookForm.get('urlImagePrevisualisation')?.setValue(this.bookForm.get('srcImage')?.value);
  }

  /**
  * Permet si l'image de prévisualisation ne s'affiche pas de la changer par une image par defaut.
  */
  handleImageError() {
    this.bookForm.get('urlImagePrevisualisation')?.setValue(globalVariables.IMAGE_DEFAULT_PATH);
  }

  /**
   * Update un book.
   */
  updateBook() {
    const bookToUpdate: Book = this.transformFormInBook(this.bookForm);
    // Si isBookFind est true alors on n'ajoute aucun livre.
    if(this.gestionBookService.books.find(bookElement => bookElement.nom === bookToUpdate.nom && bookElement.id != bookToUpdate.id)){
      this.bookForm.setErrors({ bookDejaExistant: true });
      return;
    }

    this.gestionBookService.updateBook(bookToUpdate).subscribe({
      // Tous les appels ont été réussis.
      next: (book) => {
        this.gestionBookService.books[this.gestionBookService.books.findIndex(bookElement => bookElement.id === book.id)] = bookToUpdate;
        this.router.navigate([`/book/${this.book.id}`])
      },
      // On supprime tous les livres qui ont été ajoutés. Puis on rajoute à celui en erreur un message.
      error: errorResponse => this.bookForm.setErrors(this.gestionErreurAddBook(errorResponse.status))
    });
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
    return {id: this.book.id, idUser: this.book.idUser, nom: nom, prenomAuteur: prenomAuteur, nomAuteur: nomAuteur, description: description, dateParution: dateParution, lu: lu, srcImage: srcImage}
  }
}
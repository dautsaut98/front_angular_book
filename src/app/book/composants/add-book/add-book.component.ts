import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GestionBookService } from '../../services/gestion-book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit{
  bookForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private gestionBookService:GestionBookService) {}

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      books: this.formBuilder.array([this.buildBook()])
    });
  }

  buildBook(): FormGroup{
    return this.formBuilder.group({
      nom: [''],
      description: [''],
      dateParution: [''],
      lu: [false],
      prenomAuteur: [''],
      nomAuteur : ['']
    });
  }

  /**
   * Retourne la liste des books pour l'html.
   */
  get books(): FormArray{
    return <FormArray>this.bookForm.get('books');
  }

  /**
   * Ajoute un livre.
   */
  addFormBook(){
    this.books.push(this.buildBook());
  }

  /**
   * Supprime un livre.
   */
  deleteFormBook(index: number){
    this.books.removeAt(index);
  }

  /**
   * Ajoute un/des livre(s).
   */
  addBook(){
    this.books.controls.forEach(book =>{
      const nom: string = book.get('nom')?.value;
      const description: string = book.get('description')?.value;
      const dateParution: string = book.get('dateParution')?.value;
      const lu: string = book.get('lu')?.value;
      const prenomAuteur: string = book.get('prenomAuteur')?.value;
      const nomAuteur: string = book.get('nomAuteur')?.value;

      this.gestionBookService.addBook({id:-1, idUser:-1, nom:nom, prenomAuteur:prenomAuteur, nomAuteur:nomAuteur,
      description:description, dateParution:dateParution, lu: !!lu});
    });
  }
}
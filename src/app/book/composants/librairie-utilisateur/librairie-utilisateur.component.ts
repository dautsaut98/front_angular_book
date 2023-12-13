import { Component, OnInit } from '@angular/core';
import { GestionBookService } from '../../services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-librairie-utilisateur',
  templateUrl: './librairie-utilisateur.component.html',
  styleUrls: ['./librairie-utilisateur.component.scss']
})
export class LibrairieUtilisateurComponent implements OnInit{
  filter: string = "";
  idUser: number = null;

  mapFilter = [
    {filterKey: "", 
    filterValue: () => this.gestionBookService.getBooks()},

    {filterKey: "lu", 
    filterValue: () => this.gestionBookService.getBooks().filter(book => book.lu)},

    {filterKey: "nonLu", 
    filterValue: () => this.gestionBookService.getBooks().filter(book => !book.lu)}
  ];

  constructor(private gestionBookService: GestionBookService,
    private gestionUtilisateurService: GestionUtilisateurService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => this.filter = params['filter'] ?? '');

    this.idUser = this.gestionUtilisateurService.utilisateurSubject.getValue()?.id ?? null;
  }

  getBooks(): Book[]{
    return this.mapFilter.find(filterElement => filterElement.filterKey === this.filter)?.filterValue()!;
  }
}
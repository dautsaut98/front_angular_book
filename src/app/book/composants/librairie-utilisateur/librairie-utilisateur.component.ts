import { Component, OnDestroy, OnInit } from '@angular/core';
import { GestionBookService } from '../../services/gestion-book.service';
import { Book } from 'src/app/models/book';
import { GestionUtilisateurService } from 'src/app/utilisateur/services/gestion-utilisateur.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-librairie-utilisateur',
  templateUrl: './librairie-utilisateur.component.html',
  styleUrls: ['./librairie-utilisateur.component.scss']
})
export class LibrairieUtilisateurComponent implements OnInit, OnDestroy {
  filter: string = "";

  listeLivre: Book[] = [];

  mapFilter = [
    {
      filterKey: "",
      filterValue: () => this.listeLivre
    },

    {
      filterKey: "lu",
      filterValue: () => this.listeLivre.filter(book => book.lu)
    },

    {
      filterKey: "nonLu",
      filterValue: () => this.listeLivre.filter(book => !book.lu)
    }
  ];

  private subscriptions: Subscription[] = [];

  constructor(private gestionBookService: GestionBookService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions = [];
    this.gestionBookService.getBooks().subscribe({
      next: books => this.listeLivre = books,
      error: () => this.listeLivre = []
    });

    this.route.queryParams.subscribe((params) => this.filter = params['filter'] ?? '');
  }

  getBooks(): Book[] {
    return this.mapFilter.find(filterElement => filterElement.filterKey === this.filter)?.filterValue()!;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
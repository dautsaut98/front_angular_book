import { InMemoryDbService } from "angular-in-memory-web-api";
import { Utilisateur } from "../models/utilisateur";
import { Book } from "../models/book";

export class Utilisateurs implements InMemoryDbService{

    createDb() {
        const utilisateurs: Utilisateur[] = [
            {id: 1, login: "dautsaut", password: "password", prenom: "arthur", nom: "ferey", email:"dautsaut@gmail.com"},
            {id: 2, login: "dautsaut2", password: "password", prenom: "arthur", nom: "ferey", email:"dautsaut2@gmail.com"}
        ];

        const books: Book[] = [
            {id:1, idUtilisateur:1, nom:"livre 1", prenomAuteur:"jean", nomAuteur:"bon", description:"description 1", dateParution:"1984", genre:[], lu: false},
            {id:2, idUtilisateur:1, nom:"livre 2", prenomAuteur:"jean", nomAuteur:"bon", description:"description 2", dateParution:"1984", genre:[], lu: true},
            {id:3, idUtilisateur:1, nom:"livre 3", prenomAuteur:"jean", nomAuteur:"bon", description:"description 3", dateParution:"1984", genre:[], lu: false},
            {id:4, idUtilisateur:2, nom:"livre 4", prenomAuteur:"jean", nomAuteur:"bon", description:"description 4", dateParution:"1984", genre:[], lu: false},
        ];
        return { utilisateurs, books };
    }
}
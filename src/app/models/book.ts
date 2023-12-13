import { Genre } from "./genre";

export interface Book {
    id: number;
    idUtilisateur: number;
    genre: Genre[];
    nom: string;
    prenomAuteur: string;
    nomAuteur: string;
    description: string;
    dateParution: string;
    lu: boolean;
}

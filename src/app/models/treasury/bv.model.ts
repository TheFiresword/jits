import { Month } from "../utils";

export interface BV{
    id: string,
    studyReference: string,
    emitDate: Date,
    paymentDate: Date,
    declarationMonth: Month,
    jeh: number,
    bruteRetribution: number,
    rate: string,
    assietteCotisation: number,
    cotisationJunior: number,
    cotisationEtudiant: number,
    totalCotisation: number,
    netRetribution: number,
    accountingBV: boolean,
    accountingBank: boolean,

}

export const BvTablefy = {
    id: "N° BV",
    studyReference: "Référence Etude",
    emitDate: "Date émission",
    paymentDate : "Date de paiement",
    declarationMonth:  "Mois décla URSSAF",
    jeh: "Nb JEH",
    bruteRetribution: "Retri. brute",
    rate: "Taux",
    assietteCotisation: "Assiette cotisation",
    cotisationJunior: "Cotiz. (Junior)",
    cotisationEtudiant: "Cotiz. (Etudiant)",
    totalCotisation: "Total cotiz.",
    netRetribution: "Rétri. nette",
    accountingBV: "BV",
    accountingBank: "BQ"
}
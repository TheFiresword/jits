import { ClientStatus, Localization, Month } from "../utils"

export interface SaleInvoice{

    id: string,
    studyRef: string,
    label: string,
    localization: Localization,
    clientStatus: ClientStatus,
    emitDate: Date,
    dueDate: Date,
    htJeh: number,
    htCosts: number,
    htTotal: number,
    vatToCollect: number,
    allTaxesIncluded: number,

    paymentDate: Date,
    daysLate: number,
    tvaDeclarationPeriod: Month,
    
    accountingSale: boolean,
    accountingBank: boolean,

    comments: string,
    relaunchStep?: any
}

export const SaleInvoiceTablefy = {
    id: 'Id',
    studyRef: 'Référence étude',
    label: 'Libellé',
    localization: 'Localisation',
    clientStatus: 'Statut client',
    emitDate: 'Date d\'émission',
    dueDate: 'Date d\'écheance',
    htJeh: 'HT JEH',
    htCosts: 'HT frais',
    htTotal: 'Total HT',
    vatToCollect: 'TVA à collecter',
    allTaxesIncluded: 'TTC',
    paymentDate: 'Date de paiement',
    daysLate: 'Jours de retard',
    tvaDeclarationPeriod: 'Mois déclaratif TVA',
    accountingSale: 'VT',
    accountingBank: 'BQ',
    comments: 'Commentaires'
}
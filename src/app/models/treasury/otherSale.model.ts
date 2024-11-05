import { Localization, Month } from "../utils"

export interface OtherSaleInvoice{

    id: string,
    budgetPart: string,
    label: string,
    localization: Localization,
    emitDate: Date,
    dueDate: Date,
    exludingTaxes: number,
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

export const otherSaleInvoiceTablefy = {
    id: 'Id',
    budgetPart: 'Budget',
    label: 'Libellé',
    localization: 'Localisation',
    emitDate: 'Date d\'émission',
    dueDate: 'Date d\'écheance',
    exludingTaxes: 'HT',
    vatToCollect: 'TVA à collecter',
    allTaxesIncluded: 'TTC',
    paymentDate: 'Date de paiement',
    daysLate: 'Jours de retard',
    tvaDeclarationPeriod: 'Mois déclaratif TVA',
    accountingSale: 'VT',
    accountingBank: 'BQ',
    comments: 'Commentaires'
}
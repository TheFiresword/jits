export enum PurchaseInvoiceType{
    ndf= 'NDF',
    supplier='Facture fournisseur',
    property = "Acquisition"
};
import { Localization, Month } from "../utils"

export interface PurchaseInvoice{

    id: string,
    type: PurchaseInvoiceType,
    label: string,
    localization: Localization,
    receiptDate: Date,
    tvaDeclarationPeriod: Month,
    excludingTax: number,
    vat: number,
    allTaxesIncluded: number,
    budgetPart: string,

    isPaid: boolean
    paymentDate: Date,
    accountingPurchase: boolean,
    accountingSale: boolean,
    
    comments: string

}
export const PurchaseInvoiceTablefy = {
    id: 'ID',
    type: 'Type',
    label: 'Libellé',
    localization: 'Localisation',
    receiptDate: 'Date de réception',
    tvaDeclarationPeriod: 'Période TVA',
    excludingTax: 'HT',
    vat: 'TVA',
    allTaxesIncluded: 'TTC',
    budgetPart: 'Budget',
    isPaid: 'Payé',
    paymentDate: 'Date de paiement',
    accountingPurchase: 'Comptabilité Achats',
    accountingSale: 'Comptabilité Ventes',
    comments: 'Commentaires'
}
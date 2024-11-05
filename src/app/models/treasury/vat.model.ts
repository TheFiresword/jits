import { Month } from "../utils";

export interface VatMetrics{
    month: Month,
    productsLiableToVat: number, 
    productsNonLiableToVat: number,
    purchasesLiableToVat: number,
    purchasesNonLiableToVat: number,
    productsDomTom : number,
    purchasesWithAutoliquidation: number,
    ueAcquisitions: number,
    collectedVat: number,
    deductibleVat: number,
    servicesVat: number,
    propertiesVat: number,
    lastCreditReport: number,
    vatToPay: number,
    creditToReport: number
}
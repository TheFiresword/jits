import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, tap} from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { PurchaseInvoice, PurchaseInvoiceType } from 'src/app/models/treasury/purchase.model';
import { SaleInvoice } from 'src/app/models/treasury/sale.model';
import { helpers } from '../utilities/helpers';
import { OtherSaleInvoice } from 'src/app/models/treasury/otherSale.model';
import { ClientStatus, Localization, Month } from 'src/app/models/utils';
import { AccountingGeneralService } from './general';
import { VatMetrics } from 'src/app/models/treasury/vat.model';


@Injectable({
    providedIn: 'root'
})
export class TransactionsService {

    constructor(private http: HttpClient, private general: AccountingGeneralService){}
    allSales: SaleInvoice[];
    allOtherSales: OtherSaleInvoice[];
    allPurchases: PurchaseInvoice[];
    vatMetrics: VatMetrics

    ngOnInit(){

    }

    getAllPurchases(): Observable<PurchaseInvoice[]>{
        if(this.allPurchases)
            return of(this.allPurchases);
        return this.http.get<PurchaseInvoice[]>('assets/files/autoTests/purchases2022.json').pipe(
            tap((result)=>this.allPurchases=result)
        )
    }

    getOnePurchaseInfos(id: string): Observable<PurchaseInvoice>{
        return this.getAllPurchases().pipe(
            map(
                (purchases: PurchaseInvoice[]) => { 
                    let found : PurchaseInvoice = purchases.find( purchase=>purchase.id === id); 
                    return found;
                }
            )
        );        
    };

    getAllSales():Observable<SaleInvoice[]>{
        if(this.allSales)
            return of(this.allSales);
        return this.http.get<SaleInvoice[]>('assets/files/autoTests/sales2022.json').pipe(
            tap((result)=>this.allSales=result)
        );
    }
    
    getOtherSales(): Observable<OtherSaleInvoice[]>{
        if(this.allOtherSales)
            return of(this.allOtherSales);
        return this.http.get<OtherSaleInvoice[]>('assets/files/autoTests/otherSales2022.json').pipe(
            tap((result)=>this.allOtherSales=result)
        );
    }

    getDebtsOnPeriod(delimiter: Date): Observable<number> {
        return this.getAllPurchases().pipe<number>(
          map((purchases: PurchaseInvoice[]) => {
            const purchasesNotSolded = purchases.filter((purchase:PurchaseInvoice) => !helpers.isDate(purchase.paymentDate) && new Date(purchase.receiptDate).getTime() <= delimiter.getTime());
            const debtAmount = purchasesNotSolded.reduce((totalDebt:number, purchase:PurchaseInvoice) => totalDebt + purchase.allTaxesIncluded, 0);
            return debtAmount;
          })
        );
      }

    getCustomerDebtsOnPeriod(delimiter: Date): Observable<number>{
        return this.getAllSales().pipe<number>(
            map(
                (sales: SaleInvoice[])=>{
                    const salesNotSolded = sales.filter((sale: SaleInvoice)=> !helpers.isDate(sale.paymentDate) && new Date(sale.dueDate).getTime() < delimiter.getTime());
                    return salesNotSolded.reduce((cstmDebtAmount: number, sale: SaleInvoice)=> cstmDebtAmount + sale.allTaxesIncluded, 0);
                }
            )
        )
    }
    
    getOtherEntitiesDebtsOnPeriod(delimiter: Date):Observable<number>{
        return this.getOtherSales().pipe<number>(
            map(
                (otherSales: OtherSaleInvoice[])=>{
                    return otherSales.filter((sale: OtherSaleInvoice)=> !helpers.isDate(sale.paymentDate) && new Date(sale.dueDate).getTime() < delimiter.getTime())
                    .reduce((entityDebtAmount: number, sale: OtherSaleInvoice)=> entityDebtAmount + sale.allTaxesIncluded, 0);
                }
            )
        )
    }

    getLastDeclarationCredit(): Observable<number>{
        return of(0)
    }

    private checkPeriod(date: Date, month: Month, year: number){
        return helpers.getFrenchMonth(date)===month && date.getFullYear() === year
    }

    getVatMetrics(month: Month, year: number): Observable<VatMetrics>{
        const validYear = new RegExp("^20[0-9]{2}").test(String(year)) ? year : new Date().getFullYear();

        return combineLatest([this.getAllSales(), this.getOtherSales(), this.getAllPurchases()]).pipe(
            map(
            ([sales, otherSales, purchases])=>{
                if(sales && otherSales && purchases){

                    const salesTotalHt: {liableToVAT: number, nonLiableToVAT: number, domTom: number} = 
                    sales.filter((sale: SaleInvoice)=> this.checkPeriod(new Date(sale.paymentDate), month, validYear))
                    
                    .reduce(
                        (totalHT: {liableToVAT: number, nonLiableToVAT: number, domTom: number}, sale: SaleInvoice) =>
                        
                        {                     
                            if (sale.vatToCollect == 0){
                                if(sale.localization === Localization.dom && sale.clientStatus === ClientStatus.ass){
                                    return {
                                        liableToVAT: totalHT.liableToVAT,
                                        nonLiableToVAT: totalHT.nonLiableToVAT,
                                        domTom: totalHT.domTom + sale.htTotal
                                    }
                                }
                                else{
                                    return {
                                        liableToVAT: totalHT.liableToVAT,
                                        nonLiableToVAT: totalHT.nonLiableToVAT + sale.htTotal,
                                        domTom: totalHT.domTom
                                    }
                                }
                            }
                            else{
                                if(sale.localization === Localization.met || (new Array(Localization.dom, Localization.eur).includes(sale.localization) && sale.clientStatus === ClientStatus.noa)){
                                    return {
                                        liableToVAT: totalHT.liableToVAT + sale.htTotal,
                                        nonLiableToVAT: totalHT.nonLiableToVAT,
                                        domTom: totalHT.domTom
                                    }
                                }
                                else{
                                    return {
                                        liableToVAT: totalHT.liableToVAT,
                                        nonLiableToVAT: totalHT.nonLiableToVAT,
                                        domTom: totalHT.domTom
                                    }
                                }
                            }                         
                        },

                        {liableToVAT: 0, nonLiableToVAT: 0, domTom: 0}
                    );

                    const otherSalesTotalHt: {liableToVAT: number, nonLiableToVAT: number} = 
                    otherSales.filter((otherSale: OtherSaleInvoice)=> this.checkPeriod(new Date(otherSale.paymentDate), month, validYear))
                    
                    .reduce(
                        (totalHT: {liableToVAT: number, nonLiableToVAT: number}, otherSale: OtherSaleInvoice) =>
                        
                        otherSale.vatToCollect > 0? 
                            {
                                liableToVAT: totalHT.liableToVAT + otherSale.exludingTaxes,
                                nonLiableToVAT: totalHT.nonLiableToVAT
                            }:
                            {
                                liableToVAT: totalHT.liableToVAT,
                                nonLiableToVAT: totalHT.nonLiableToVAT + otherSale.exludingTaxes
                            },

                        {liableToVAT: 0, nonLiableToVAT: 0}
                    );

                    const purchasesRelated: {
                        liableToVAT: number, 
                        nonLiableToVAT: number, 
                        autoliquidationServices: number, 
                        autoliquidationProperties: number, 
                        propertiesVat: number,
                        servicesVat: number,
                        totalDeductibleVat: number
                    } = 
                    purchases.filter((purchase: PurchaseInvoice)=> this.checkPeriod(new Date(purchase.receiptDate), month, validYear))
                    
                    .reduce(
                        (totalHT: {liableToVAT: number, nonLiableToVAT: number, autoliquidationServices: number, 
                            autoliquidationProperties: number, propertiesVat: number, servicesVat:number, totalDeductibleVat:number}, purchase: PurchaseInvoice) =>
                        {
                            if(purchase.vat > 0){
                                return {
                                    liableToVAT: totalHT.liableToVAT + purchase.excludingTax,
                                    nonLiableToVAT: totalHT.nonLiableToVAT,
                                    autoliquidationServices: totalHT.autoliquidationServices,
                                    autoliquidationProperties: totalHT.autoliquidationProperties,

                                    propertiesVat: (purchase.type === PurchaseInvoiceType.property)? totalHT.propertiesVat + purchase.vat : totalHT.propertiesVat,
                                    servicesVat: (purchase.type === PurchaseInvoiceType.supplier || purchase.type === PurchaseInvoiceType.ndf)? totalHT.servicesVat + purchase.vat : totalHT.servicesVat,
                                    totalDeductibleVat: totalHT.totalDeductibleVat + purchase.vat,
                                }
                            }
                            else{
                                return  {
                                    liableToVAT: totalHT.liableToVAT,
                                    nonLiableToVAT: totalHT.nonLiableToVAT + purchase.excludingTax,
                                    autoliquidationServices: (!(new Array(Localization.met, Localization.dom).includes(purchase.localization)) && purchase.type === PurchaseInvoiceType.supplier) ? 
                                        totalHT.autoliquidationServices + purchase.excludingTax: totalHT.autoliquidationServices,
                                    autoliquidationProperties: (purchase.localization === Localization.eur && purchase.type === PurchaseInvoiceType.property) ? 
                                        totalHT.autoliquidationProperties + purchase.excludingTax: totalHT.autoliquidationProperties,
                                        
                                    propertiesVat: totalHT.propertiesVat,
                                    servicesVat: totalHT.servicesVat,
                                    totalDeductibleVat: totalHT.totalDeductibleVat
                                }
                            }
                            
                        },

                        {liableToVAT: 0, nonLiableToVAT: 0, autoliquidationServices: 0, autoliquidationProperties: 0, propertiesVat: 0, servicesVat: 0, totalDeductibleVat: 0}
                    );
                    

                    // Base HT des produits soumis à la TVA en France métropolitaine
                    const productsLiableToVat = salesTotalHt.liableToVAT + otherSalesTotalHt.liableToVAT;

                    // Base HT des ventes à destination des DOM-TOM (Hors Mayotte et Guyanne)
                    const productsDomTom = salesTotalHt.domTom;

                    // Base HT des produits non soumis à la TVA
                    const productsNonLiableToVat = salesTotalHt.nonLiableToVAT;
                    
                    // Montant HT des achats soumis à la TVA
                    const purchasesLiableToVat = purchasesRelated.liableToVAT;

                    //Montant HT des achats non soumis à la TVA
                    const purchasesNonLiableToVat = purchasesRelated.nonLiableToVAT;

                    // Montant des achats de prestations de service auprès d'un assujeti non Français
                    const purchasesWithAutoliquidation = purchasesRelated.autoliquidationServices;

                    // Montant des achats de biens dans d'autres pays de l'UE
                    const ueAcquisitions = purchasesRelated.autoliquidationProperties;

                    // TVA collectée
                    const collectedVat = productsLiableToVat * this.general.getVatRates().Metropole;
                    
                    // TVA déductible
                    const deductibleVat = purchasesRelated.totalDeductibleVat;

                    // TVA déductible sur acquisitions
                    const propertiesVat = purchasesRelated.propertiesVat;

                    // TVA déductible sur biens et services
                    const servicesVat = purchasesRelated.servicesVat;

                    //console.log(deductibleVat);

                    // Report de TVA du mois précédent
                    const lastCreditReport = 45.00;

                    // TVA à décaisser
                    const vatToPay = Math.max(0, collectedVat-deductibleVat-lastCreditReport);

                    // Crédit de TVA à reporter
                    const creditToReport = -Math.min(0, collectedVat-deductibleVat-lastCreditReport);


                    return {
                        month: month,
                        productsLiableToVat: productsLiableToVat,
                        purchasesLiableToVat: purchasesLiableToVat,
                        productsNonLiableToVat: productsNonLiableToVat,
                        productsDomTom: productsDomTom,
                        purchasesNonLiableToVat: purchasesNonLiableToVat,
                        purchasesWithAutoliquidation: purchasesWithAutoliquidation,
                        ueAcquisitions : ueAcquisitions,
                        collectedVat: collectedVat,
                        deductibleVat: deductibleVat,
                        propertiesVat: propertiesVat,
                        servicesVat: servicesVat,
                        lastCreditReport: lastCreditReport,
                        vatToPay: vatToPay,
                        creditToReport: creditToReport
                    }
                }
                return {
                    month: month,
                    productsLiableToVat: 0, 
                    productsNonLiableToVat: 0,
                    productsDomTom: 0,
                    purchasesLiableToVat: 0,
                    purchasesNonLiableToVat: 0,
                    purchasesWithAutoliquidation: 0,
                    ueAcquisitions: 0,
                    collectedVat: 0,
                    deductibleVat: 0,
                    propertiesVat: 0,
                    servicesVat: 0,
                    lastCreditReport: 0,
                    vatToPay: 0,
                    creditToReport: 0
                }
            }
            )
        )
    }

    getPeriodVatMetrics(period: [Month, number][]):Observable<VatMetrics[]>{
        const observablesToTrigger = period.map( ([month, year]): Observable<VatMetrics> => {return this.getVatMetrics(month, year)});
        return combineLatest<VatMetrics[]>(observablesToTrigger)
    }

    getMonthlySalesRevenues(): Observable<{months: Month[], revenues: number[]}>{
        return combineLatest([this.getAllSales(), this.getOtherSales()]).pipe(
            map(
            ([sales, otherSales])=>{
                let notLoadedResult = {months: [], revenues: []};
                for(let elmt of Object.values(Month)){
                    notLoadedResult.months.push(elmt);
                    notLoadedResult.revenues.push(0.00);
                }

                let cloneInitialiser = {months: [], revenues: []};
                for(let elmt of Object.values(Month)){
                    cloneInitialiser.months.push(elmt);
                    cloneInitialiser.revenues.push(0.00);
                }

                if(sales && otherSales){
                    const salesRevenues = sales.reduce(
                        (monthlyRevenues: {months: Month[], revenues: number[]}, sale: SaleInvoice) => 
                        
                        {
                            let saleMonth = new Date(sale.emitDate).getMonth();
                            monthlyRevenues.revenues[`${saleMonth}`] += sale.htTotal;
                            return monthlyRevenues
                        }
                         , notLoadedResult
                    );
                    
                    //console.log(salesRevenues);
                    /*
                    let otherSalesRevenues = otherSales.reduce(
                        (monthlyRevenues: {months: Month[], revenues: number[]}, otherSale: OtherSaleInvoice) =>
                        {
                            let otherSaleMonth = new Date(otherSale.emitDate).getMonth();
                            monthlyRevenues.revenues[`${otherSaleMonth}`] += otherSale.exludingTaxes;
                            return monthlyRevenues;
                        },
                        cloneInitialiser
                    );

                    otherSalesRevenues.revenues = otherSalesRevenues.revenues.map(
                        (otherSaleRevenue, index:number) => otherSaleRevenue + salesRevenues.revenues[index]
                    );

                    //console.log(otherSalesRevenues);
                    return otherSalesRevenues;
                    */
                }
                
                return notLoadedResult;
            })
        )
    }
}
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PurchaseInvoice } from 'src/app/models/treasury/purchase.model';
import { TransactionsService } from 'src/app/services/accounting/transactions';
import * as bootstrap from 'bootstrap';
import { SaleInvoice } from 'src/app/models/treasury/sale.model';
import * as XLSX from 'xlsx';
import { OtherSaleInvoice } from 'src/app/models/treasury/otherSale.model';
import { Month } from 'src/app/models/utils';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { VatMetrics } from 'src/app/models/treasury/vat.model';
import { helpers } from 'src/app/services/utilities/helpers';
import { AccountingGeneralService } from 'src/app/services/accounting/general';
import { TaxRates } from 'src/app/models/treasury/taxRates.model';
import { ConfirmService } from 'src/app/services/alert/confirm.service';
import { TableEvent, eventType, tableType } from 'src/app/models/dataTable-event.model';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-treasury',
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss']
})
export class TreasuryComponent {
  purchases: PurchaseInvoice[]=[];
  debtsOnToday: number=0;

  sales: SaleInvoice[] = [];
  otherSales: OtherSaleInvoice[]=[];
  cstmerDebtsOnToday: number=0;
  otherClientsDebtsOnToday: number = 0;

  months = Object.values(Month);
  tvaMonth: Month;
  vatMetrics: VatMetrics = {
        month: Month.jan,
        productsLiableToVat: 0, 
        productsNonLiableToVat: 0,
        productsDomTom: 0,
        purchasesLiableToVat: 0,
        purchasesNonLiableToVat: 0,
        purchasesWithAutoliquidation: 0,
        ueAcquisitions: 0,
        collectedVat: 0,
        deductibleVat: 0,
        servicesVat: 0,
        propertiesVat: 0,
        lastCreditReport: 0,
        vatToPay: 0,
        creditToReport: 0
  };

  taxRates: TaxRates[]=[];

  today: {day:string, month: string, year: string} = {day: "", month: "", year: ""};

  dtOptions: DataTables.Settings = {};

  changeRateForm: FormGroup

  constructor(private treasurygeneralService: AccountingGeneralService, private transactionsService: TransactionsService,
    private fb: FormBuilder, private confirmService: ConfirmService, private router : Router, private alertService: AlertService){}

  ngOnInit(){
    /**Fermeture du menu déroulant sur le côté */
    var myCollapse = document.getElementById('lg-sidebar');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: true
    });

    this.today.day = new Date().getDate().toString()
    this.today.month = helpers.getFrenchMonth(new Date());
    this.today.year = new Date().getFullYear().toString()
    this.tvaMonth = this.today.month as Month;

    // Initialiser le générateur de tableau
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        processing:     "Traitement en cours...",
        search:         "Rechercher&nbsp;:",
        lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
        info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix:    "",
        loadingRecords: "Chargement en cours...",
        zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable:     "Aucune donnée disponible dans le tableau",
        paginate: {
            first:      "",
            previous:   "<",
            next:       ">",
            last:       ""
        },
        aria: {
            sortAscending:  ": activer pour trier la colonne par ordre croissant",
            sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      }    
    }

    // Initialiser les données d'achat et de vente
    this.loadPurchasesData();
    this.loadSalesData();
    this.loadOtherSalesData();
    this.loadVatMetrics(this.tvaMonth);
    this.getTaxRates();

    this.getAllDebtsOnToday();
    this.getAllCstmDebtsOnToday();
    this.getOtherCstmDebtsOnToday();

    this.changeRateForm = this.fb.group({
      securiteSocialeEtu: [''],
      accidentTravailJunior: [''],
      smic: ['']
    })
        
  }

  loadPurchasesData(){
    this.transactionsService.getAllPurchases().subscribe(
      (result)=> {
        this.purchases = result;
      }
    )
  }

  loadSalesData(){
    this.transactionsService.getAllSales().subscribe(
      (result)=>{
        this.sales = result;
      }
    )
  }

  loadOtherSalesData(){
    this.transactionsService.getOtherSales().subscribe(
      result => {this.otherSales = result}
    )
  }

  loadVatMetrics(month: Month){
    this.transactionsService.getVatMetrics(month, 2022).subscribe(
      result => {this.vatMetrics = result}
    )
  }

  getAllDebtsOnToday(){
    this.transactionsService.getDebtsOnPeriod(new Date()).subscribe(
      result=> {this.debtsOnToday = result}
    )
  }
  getAllCstmDebtsOnToday(){
    this.transactionsService.getCustomerDebtsOnPeriod(new Date()).subscribe(
      result => {this.cstmerDebtsOnToday = result}
    )
  }

  getOtherCstmDebtsOnToday(){
    this.transactionsService.getOtherEntitiesDebtsOnPeriod(new Date()).subscribe(
      result => { this.otherClientsDebtsOnToday = result}
    )
  }

  getMonthlySalesRevenues(){
    this.transactionsService.getMonthlySalesRevenues().subscribe(
      (result)=>{

      }
    )
  }

  getTaxRates(){
    this.treasurygeneralService.getTaxRates().subscribe(
      (result)=>{
        this.taxRates = result;
        //console.log(result)
      }
    )
  }

  exportTable(id: string, name:string){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.querySelector(`table#${id}`));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Feuille1');

    // Sauvegarder le fichier Excel
    XLSX.writeFile(wb, `${name}.xlsx`);
  }

  changeMonth(month: Month){
    this.tvaMonth = month;
    this.loadVatMetrics(this.tvaMonth);
  }
  
  closeCollapse(){
    
    var myCollapse = document.getElementById('taxRatescollapse')
    new bootstrap.Collapse(myCollapse, {
      toggle: true
    })
  }

  onSubmitChangeRates(taxRatePlan: string){
    const changes = this.changeRateForm.value;
    this.closeCollapse()
  }
  
  monitorAction(event: TableEvent){
    if(event.type === eventType.delete){
      this.confirmService.openConfirmDialog('1000ms', '1000ms').subscribe(
        (result)=>{
          if(result=="Yes") console.log("Entrée supprimée")
          else console.log("Suppression infirmée");
        }
      );
    }
    else if(event.type === eventType.add){

    }
    else if(event.type === eventType.details){
      switch(event.tableType){
        case tableType.PurchaseInvoice:
          if(!event.target){
            this.alertService.error("L'identifiant de l'achat est invalide")
            return;
          }
          this.router.navigate([`treasury/purchase/${event.target}`]);
        break
        case tableType.SaleInvoice:
          if(!event.target){
            this.alertService.error("L'identifiant de la vente est invalide")
            return;
          }
          this.router.navigate([`treasury/purchase/${event.target}`]);
        break
      }
      
    }
    else if(event.type === eventType.modify){

    }
  }

  toogleTvaDeclForm(){
    var myCollapse = document.getElementById('vat-decl')
    new bootstrap.Collapse(myCollapse, {
      toggle: true
    })
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PurchaseInvoiceTablefy } from '../../models/treasury/purchase.model';
import { SaleInvoiceTablefy } from '../../models/treasury/sale.model';
import { helpers } from '../../services/utilities/helpers';
import { otherSaleInvoiceTablefy } from '../../models/treasury/otherSale.model';
import * as XLSX from 'xlsx';
import { TableEvent, tableType } from 'src/app/models/dataTable-event.model';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit{
  @Input() tableType: tableType;
  @Input() dataArray: any;
  @Input() tableId: string;
  @Output() userAction = new EventEmitter<TableEvent>()

  colsNames: Object;
  colsLabels: Object;
  exportName: string;
  dtOptions: DataTables.Settings = {};
  helpers:any=helpers;

  constructor(){
    
  }
  ngOnInit(){
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
    this.getCols();
  }


  getCols(){
    switch(this.tableType){
      case tableType.PurchaseInvoice:
        this.colsNames = Object.values(PurchaseInvoiceTablefy);
        this.colsLabels = Object.keys(PurchaseInvoiceTablefy);
        this.exportName = "Liste des achats";
        break;
      case tableType.SaleInvoice:
        this.colsNames = Object.values(SaleInvoiceTablefy);
        this.colsLabels = Object.keys(SaleInvoiceTablefy);
        this.exportName = "Liste des ventes";
      break;
      case tableType.otherSaleInvoice:
        this.colsNames = Object.values(otherSaleInvoiceTablefy);
        this.colsLabels = Object.keys(otherSaleInvoiceTablefy);
        this.exportName = "Liste des autres recettes";
      break;
      case tableType.Student:
        this.colsNames = ["", "Prénom", "Nom", "Poste", "Actif", "Email", "Année scolaire"];
        this.colsLabels = ["avatar", "firstname", "lastname", "role", "availability", "email", "schoolInfos"];
        this.exportName = "Liste des étudiants";
      break;

    }
    
  }

  exportTable(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.querySelector(`table#${this.tableId}`));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Feuille1');
    XLSX.writeFile(wb, `${this.exportName}.xlsx`);
  }
}

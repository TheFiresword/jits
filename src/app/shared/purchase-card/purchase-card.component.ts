import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { PurchaseInvoice } from 'src/app/models/treasury/purchase.model';
import { Localization } from 'src/app/models/utils';
import { TransactionsService } from 'src/app/services/accounting/transactions';
import { AlertService } from 'src/app/services/alert/alert.service';
@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss']
})
export class PurchaseCardComponent {
  thePurchase : PurchaseInvoice
  transactionForm: FormGroup
  changeState: boolean
  todayDate : String

  getLocValues(){
    console.log(Object.values(Localization))
    return Object.values(Localization)
  }

  isTransactionPaid(){
    return !!(this.transactionForm.get('transactionPaid').value)
  }

  isTransactionAccounted(){
    return !!(this.transactionForm.get('accounted').value)
  }

  constructor(private fb: FormBuilder, private transactions: TransactionsService, private route : ActivatedRoute, private alertService: AlertService){}

  ngOnInit(){
    var myCollapse = document.getElementById('lg-sidebar');
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: true
    });
    
    const [day, month, year] = new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    this.todayDate = `${year}-${month}-${day}`;    

    this.transactionForm = this.fb.group(
      {
        type : [''],
        id: [''],
        partner: [''],
        localization: [''],
        transactionPaid : [''],
        transactionStart : [''],
        description : [''],
        vat : [''],
        ttc : [''],
        ht: [''],
        budgetPart : [''],
        comments : [''],
        accounted : ['']
      }
    );

    this.transactions.getOnePurchaseInfos(String(this.route.snapshot.paramMap.get('id'))).subscribe(
      (result) => {
        if(!result){
          this.alertService.error("Erreur lors de la récupération des informations de l'achat");
          return;
        }          
        this.thePurchase = result;
        this.transactionForm.patchValue({type : 'Achat', id: this.thePurchase.id, partner : 'Free Mobile', localization : this.thePurchase.localization,
        transactionStart : this.thePurchase.receiptDate, transactionPaid : this.thePurchase.paymentDate, description : this.thePurchase.label,
        vat : this.thePurchase.vat, ttc : this.thePurchase.allTaxesIncluded, ht : this.thePurchase.excludingTax, comments : this.thePurchase.comments,
        accounted : this.thePurchase.accountingPurchase})
      }
    );
    
    document.querySelectorAll('input').forEach((input)=>input.setAttribute('readonly', 'true'));
  }

  activateChange(){
    this.changeState = true;
    document.querySelectorAll('input').forEach((input)=>input.removeAttribute('readonly'));
  }

  cancelChange(){
    this.changeState = false;
    document.querySelectorAll('input').forEach((input)=>input.setAttribute('readonly', 'true')); 
  }

  onSubmitChanges(){
    window.location.reload();
  }

  initCancelFile(id:number){
    document.getElementById('modal-close-btn').click();
  }
}

import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VatMetrics } from 'src/app/models/treasury/vat.model';
import { Month } from 'src/app/models/utils';
import { AccountingGeneralService } from 'src/app/services/accounting/general';
import { TransactionsService } from 'src/app/services/accounting/transactions';

@Component({
  selector: 'app-tva-declaratif',
  templateUrl: './tva-declaratif.component.html',
  styleUrls: ['./tva-declaratif.component.scss']
})
export class TvaDeclaratifComponent implements OnInit, AfterViewInit{
  @ViewChild('I15', { static: false }) I15Ng: ElementRef;
  @ViewChild('2C', {static: false}) ng2C: ElementRef;
  @ViewChild('21', {static: false}) ng21: ElementRef;
  @ViewChild('22', {static: false}) ng22: ElementRef;
  @ViewChild('26', {static: false}) ng26: ElementRef;
  @ViewChild('B5', {static: false}) ngb5: ElementRef;

  periodToDeclare: [Month, number];
  vatMetricsOfPeriod: VatMetrics[];
  inputsValues= {
    A1: "",
    A3: "",
    B2: "",
    B5: "",
    E2:"",
    F8: "",
    '8': "",
    '10': "",
    '15': "",
    '16': "",
    '17': "",
    '19': "",
    '20': "",
    '21': "",
    '22': "",
    '23': "",
    '2C': "",
    '25': "",
    'TD': "",
    '26': "",
    '27': "",
    vat20: "",
    vat8_5: "",
  };

  sums = {
    productsLiableToVat: 0,
    autoliquidationHT: 0,
    ueAcquisitions: 0,
    nonLiableVatProducts: 0,
    productsDomTom: 0,
    propertiesVat: 0,
    servicesVat: 0,
  }
  collected: number;

  concernedMonths: [Month, number][];

  constructor(private transactionsService: TransactionsService, private general: AccountingGeneralService, private fb: FormBuilder){}

  ngOnInit(): void {
    const allMonths = Object.values(Month);
    const lastIndex = allMonths.indexOf(this.general.getLastVatDeclarationMonth()[0]);
    let declaMonthIndex = (lastIndex + this.general.getVatDeclarationPeriodicity());
    const declarYear : number = declaMonthIndex >= allMonths.length ? this.general.getLastVatDeclarationMonth()[1] + 1 : this.general.getLastVatDeclarationMonth()[1];

    this.periodToDeclare = [(allMonths[declaMonthIndex % 12] as Month), declarYear]

    declaMonthIndex = declaMonthIndex % 12
    if(declaMonthIndex-this.general.getVatDeclarationPeriodicity() >= 0){
      this.concernedMonths = allMonths.
        slice(declaMonthIndex-this.general.getVatDeclarationPeriodicity(), declaMonthIndex).
          map((month)=>{ return [month, this.general.getLastVatDeclarationMonth()[1]]});
    }
    else{
      let part1 : [Month, number][] = allMonths.
        slice(declaMonthIndex-this.general.getVatDeclarationPeriodicity()).
          map((month)=>{ return [month, this.general.getLastVatDeclarationMonth()[1]]});
      let part2 : [Month, number][] = allMonths.
        slice(0, declaMonthIndex).
          map( (month)=>{ return [month, this.general.getLastVatDeclarationMonth()[1] + 1]});

      this.concernedMonths = part1.concat(part2);
    }
    this.loadDeclarativeInfos();    
  }

  ngAfterViewInit(): void {
    /*
    const inputList = this.el.nativeElement.querySelectorAll('input');

    inputList.forEach((input: HTMLInputElement) => {
      this.renderer.setAttribute(input, 'value', '-');
    });
    */

    var I15 = this.I15Ng.nativeElement as HTMLElement;
    I15.addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues[15] = String(Math.round(Number(this.inputsValues[15])));
        this.updateComputedFields();
      }      
    });
    (this.ng2C.nativeElement as HTMLElement).addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues['2C'] = String(Math.round(Number(this.inputsValues['2C'])));
        this.updateComputedFields();        
      }
    });
    (this.ng21.nativeElement as HTMLElement).addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues['21'] = String(Math.round(Number(this.inputsValues['21'])));
        this.updateComputedFields();
      }
    });

    (this.ng26.nativeElement as HTMLElement).addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues['26'] = String(Math.round(Number(this.inputsValues['26'])));
        this.inputsValues[26] = String(Math.min(Math.round(Number(this.inputsValues[25])), Number(this.inputsValues[26])));
        this.updateComputedFields();
      }
    });

    (this.ng22.nativeElement as HTMLElement).addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues[22] = String(Math.round(Number(this.inputsValues[22])));
        this.updateComputedFields();
      }
    });

    (this.ngb5.nativeElement as HTMLElement).addEventListener('keypress', (event)=>{
      if(event.key === "Enter"){
        this.inputsValues['B5'] = String(Math.round(Number(this.inputsValues['B5'])));
        this.updateComputedFields();
      }
    })

  }

  updateComputedFields(){
    this.inputsValues[8] = `${Math.round(this.sums.productsLiableToVat) + Math.round(this.sums.autoliquidationHT) + Math.round(this.sums.ueAcquisitions) + + Math.round(Number(this.inputsValues['B5']))}`;

    this.inputsValues.vat20 = `${ Math.round(this.sums.productsLiableToVat * this.general.getVatRates().Metropole)}`;
    this.inputsValues.vat8_5 = `${ Math.round(this.sums.productsDomTom * this.general.getVatRates()['DOM-TOM'])}`;

    this.inputsValues[16] = String(Math.round(Number(this.inputsValues.vat20)) + Math.round(Number(this.inputsValues.vat8_5)) + Math.round(Number(this.inputsValues[15])));
    this.inputsValues[17] = `${ Math.round(this.sums.ueAcquisitions * this.general.getVatRates().Metropole)}`;
    this.inputsValues[23] = `${Math.round(this.sums.propertiesVat) + Math.round(this.sums.servicesVat) + Number(this.inputsValues[21]) + Number(this.inputsValues[22]) + Number(this.inputsValues['2C'])}`;
    this.inputsValues[25] = String(Math.max(0, Math.round(Number(this.inputsValues[23])) - Math.round(Number(this.inputsValues[16]))));
    this.inputsValues.TD = String(Math.max(0, Math.round(Number(-this.inputsValues[23])) + Math.round(Number(this.inputsValues[16]))));
    this.inputsValues[27] = String(Math.max(0, Math.round(Number(this.inputsValues[25])) - Math.round(Number(this.inputsValues[26]))));
  }

  loadDeclarativeInfos(){
    this.transactionsService.getPeriodVatMetrics(this.concernedMonths).subscribe(
      (result: VatMetrics[])=>{
        this.vatMetricsOfPeriod = result;

        // Objet contenant les sommes de métriques sur les mois de la période
        
        var index = 0;

        for (let monthMetric of this.vatMetricsOfPeriod){
          this.inputsValues.A1 += `${monthMetric.productsLiableToVat}`;
          this.inputsValues.A3 += `${monthMetric.purchasesWithAutoliquidation}`;
          this.inputsValues.B2 += `${monthMetric.ueAcquisitions}`;
          this.inputsValues.E2 += `${monthMetric.productsNonLiableToVat}`;
          this.inputsValues[10] += `${monthMetric.productsDomTom}`;
          this.inputsValues[19] += `${monthMetric.propertiesVat}`;
          this.inputsValues[20] += `${monthMetric.servicesVat}`;

          this.sums.productsLiableToVat += monthMetric.productsLiableToVat;
          this.sums.autoliquidationHT += monthMetric.purchasesWithAutoliquidation;
          this.sums.ueAcquisitions += monthMetric.ueAcquisitions;
          this.sums.nonLiableVatProducts += monthMetric.productsNonLiableToVat;
          this.sums.productsDomTom += monthMetric.productsDomTom;
          this.sums.propertiesVat += monthMetric.propertiesVat;
          this.sums.servicesVat += monthMetric.servicesVat;

          if(index < this.vatMetricsOfPeriod.length -1){
            this.inputsValues.A1 += " + ";
            this.inputsValues.A3 += " + ";
            this.inputsValues.B2 += " + ";
            this.inputsValues.E2 += " + ";
            this.inputsValues[10] += " + ";
            this.inputsValues[19] += " + ";
            this.inputsValues[20] += " + ";
          }
          else{
            this.inputsValues.A1 += ` = ${Math.round(this.sums.productsLiableToVat)}`;
            this.inputsValues.A3 += ` = ${Math.round(this.sums.autoliquidationHT)}`;
            this.inputsValues.B2 += ` = ${Math.round(this.sums.ueAcquisitions)}`;
            this.inputsValues.E2 += ` = ${Math.round(this.sums.nonLiableVatProducts)}`;
            this.inputsValues[10] += ` = ${Math.round(this.sums.productsDomTom)}`;
            this.inputsValues[19] += ` = ${Math.round(this.sums.propertiesVat)}`;
            this.inputsValues[20] += ` = ${Math.round(this.sums.servicesVat)}`;

            this.inputsValues[8] = `${Math.round(this.sums.productsLiableToVat) + Math.round(this.sums.autoliquidationHT) + Math.round(this.sums.ueAcquisitions)}`;
            this.inputsValues[17] = `${ Math.round(this.sums.ueAcquisitions * this.general.getVatRates().Metropole)}`;
            
            this.inputsValues.vat20 = `${ Math.round(this.sums.productsLiableToVat * this.general.getVatRates().Metropole)}`;
            this.inputsValues.vat8_5 = `${ Math.round(this.sums.productsDomTom * this.general.getVatRates()['DOM-TOM'])}`;

            this.inputsValues[23] = `${Math.round(this.sums.propertiesVat) + Math.round(this.sums.servicesVat) + Number(this.inputsValues[21]) + 
              Number(this.inputsValues[22]) + Number(this.inputsValues['2C'])}`;

            this.inputsValues[16] = String(Math.round(Number(this.inputsValues.vat20) + Number(this.inputsValues.vat8_5)) + Number(this.inputsValues[15]));

            this.inputsValues[25] = String(Math.max(0, Math.round(Number(this.inputsValues[23])) - Math.round(Number(this.inputsValues[16]))));
            this.inputsValues.TD = String(Math.max(0, Math.round(Number(-this.inputsValues[23])) + Math.round(Number(this.inputsValues[16]))));
            this.inputsValues[27] = String(Math.max(0, Math.round(Number(this.inputsValues[25])) - Math.round(Number(this.inputsValues[26]))));
          }
          index += 1;
        }
        
        
      }
    );

    
    
  }

}

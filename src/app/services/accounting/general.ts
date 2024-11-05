import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, map, of, tap} from 'rxjs';
import { TaxRates } from 'src/app/models/treasury/taxRates.model';
import { Periodicity } from 'src/app/models/treasury/tvaDeclarative';
import { Month } from 'src/app/models/utils';

@Injectable({
    providedIn: 'root'
  })
  export class AccountingGeneralService {
    constructor(private http: HttpClient){}

    ngOnInit(){

    }
    getVatDeclarationPeriodicity():Periodicity{
      return Periodicity.trimester;
    }

    getLastVatDeclarationMonth(): [Month, number]{
      return [Month.apr, 2022];
    }

    getVatRates(){
        return {
          'Metropole': 0.2,
          'DOM-TOM' : 0.085
        };
    }

    getTaxRates(): Observable<TaxRates[]>{
      return this.http.get<TaxRates[]>("/assets/files/treasury/cotisations.json");
    }
    
    getRefDocuments(): Observable<{trackingTable: string, processes: string}>{
      return of(
        {
        trackingTable: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRT7lU5Az3Um5obeee9cas5gG_BQVN65PYuGKDC9dkX4DQGmt4ed-VE_1gknoE8kg/pubhtml',
        processes: 'https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=Tresorerie.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1k0CLcT-8mNDx6Tuz3NwWSjxNaiqe6udx%26export%3Ddownload',
          
      })

    }
  }
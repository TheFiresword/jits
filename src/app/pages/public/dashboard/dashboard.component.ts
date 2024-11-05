import { Component, OnInit} from '@angular/core';
import { Pole, Role } from 'src/app/models/role.enum';
import Plotly from 'plotly.js-dist';
import { TransactionsService } from 'src/app/services/accounting/transactions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  clientsMonthlyEvolution : number = 0.0527;
  clientsNumber: number = 100;
  salesRevenue: number = 0;
  salesMonthlyEvolution: number = 0;
  JEH: number = 20; 
  JEHMonthlyEvolution: number = 1.5;
  employeesNumber: number = 5;
  employeesMonthlyEvolution: number = 0.3;

  studentPole: Pole
  studentRole: Role  

  todayDate: string;
  revenues: {year:number, month:string, revenue: number }[]


  constructor(private transactionsService: TransactionsService){
    this.studentPole = Pole.Trésorerie;
    this.studentRole = Role.Trésorier;    
  }

  ngOnInit(){    
    
    this.transactionsService.getMonthlySalesRevenues().subscribe(
      (result)=>{
        // On profite pour set quelques variables qui n'ont rien à voir avec la courbe
        this.salesRevenue = result.revenues[new Date().getMonth()];
        this.salesMonthlyEvolution = (this.salesRevenue - result.revenues[new Date().getMonth()-1])/100;
      }
    )
            
    var myPageEl = document.getElementById('page');
         
    new ResizeObserver((entries)=>{
    for(const entry of entries){
      if(entry.contentBoxSize){
        var update = {
          autosize: true,
        };
        Plotly.relayout('plotly',update);
      }
    }
    }).observe(myPageEl)
  }
}




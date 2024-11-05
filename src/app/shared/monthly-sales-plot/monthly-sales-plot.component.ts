import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist'
import { TransactionsService } from 'src/app/services/accounting/transactions';
import { helpers } from 'src/app/services/utilities/helpers';


@Component({
  selector: 'app-monthly-sales-plot',
  templateUrl: './monthly-sales-plot.component.html',
  styleUrls: ['./monthly-sales-plot.component.scss']
})
export class MonthlySalesPlotComponent implements OnInit, AfterViewInit {
  
  plotlyEl: HTMLElement;
  trace: any;
  layout: any;
  config : any;


  constructor(private transactionsService: TransactionsService){}

  @ViewChild('plotly', { static: false }) myPlotNg: ElementRef;
  
  ngOnInit(){

    this.trace = {
      type: "scatter",
      mode: "lines",
      name: 'CA mensuel',
      x: [],
      y: [],
      line: {color: '#fa5c7c'}
    };

    this.layout = {
      "margin": 0, 
      title: 'Evolution du Chiffre d\'Affaires en €',
      xaxis: {
        autorange: true,
        range: [],
        rangeslider: {},
        type: 'string'
      },
      yaxis: {
        autorange: true,
        range: [],
        type: 'linear'
      }
    }

    this.config = {
      locale: 'fr', 
      displaylogo: false, 
      responsive: true
    }
  }

  ngAfterViewInit(): void {
      this.plotlyEl = this.myPlotNg.nativeElement as HTMLElement;

      Plotly.newPlot(this.plotlyEl, [this.trace], this.layout, this.config);


    this.transactionsService.getMonthlySalesRevenues().subscribe(
      (result)=>{
        this.trace.x = result.months;
        this.trace.y = result.revenues;
        this.layout.xaxis.range = [this.trace.x[0], helpers.getFrenchMonth(new Date())];
        this.layout.xaxis.rangeslider = { range: [this.trace.x[0], helpers.getFrenchMonth(new Date())] };

        //layout.yaxis.range = [Math.min(...(trace.y as number[])), Math.max(...(trace.y as number[]))];
        Plotly.update(this.plotlyEl, [this.trace], this.layout, this.config)

      }
    )
  }
}

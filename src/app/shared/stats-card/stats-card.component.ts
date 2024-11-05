import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() statistic: any;
  @Input() iconClass: string;
  @Input() backColor: string;
  @Input() iconColor: string;
  @Input() avatarColor: string;


  @ViewChild('icon', {static: false}) iconNg: ElementRef;
  @ViewChild('card', {static: false}) cardNg: ElementRef; 
  @ViewChild('avatar', {static: false}) avatarNg: ElementRef;
  @ViewChild('statistick', {static: false}) statisticNg: ElementRef;

  constructor(){}
  
  ngOnInit(){}

  ngAfterViewInit(): void {
      let iconEl = this.iconNg.nativeElement as HTMLElement;
      iconEl.classList.add(this.iconClass);
      iconEl.style.color = this.iconColor;

      let statisticEl = this.statisticNg.nativeElement as HTMLElement;
      statisticEl.style.color = this.iconColor;
      
      let cardEl = this.cardNg.nativeElement as HTMLElement;
      cardEl.style.backgroundColor = this.backColor;

      let avatarEl = this.avatarNg.nativeElement as HTMLElement;
      avatarEl.style.backgroundColor = this.avatarColor;
  }
}

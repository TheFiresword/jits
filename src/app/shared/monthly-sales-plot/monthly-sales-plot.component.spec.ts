import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalesPlotComponent } from './monthly-sales-plot.component';

describe('MonthlySalesPlotComponent', () => {
  let component: MonthlySalesPlotComponent;
  let fixture: ComponentFixture<MonthlySalesPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySalesPlotComponent]
    });
    fixture = TestBed.createComponent(MonthlySalesPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChairmanshipComponent } from './chairmanship.component';

describe('ChairmanshipComponent', () => {
  let component: ChairmanshipComponent;
  let fixture: ComponentFixture<ChairmanshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChairmanshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChairmanshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvaDeclaratifComponent } from './tva-declaratif.component';

describe('TvaDeclaratifComponent', () => {
  let component: TvaDeclaratifComponent;
  let fixture: ComponentFixture<TvaDeclaratifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TvaDeclaratifComponent]
    });
    fixture = TestBed.createComponent(TvaDeclaratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterprisesListComponent } from './enterprises-list.component';

describe('EnterprisesListComponent', () => {
  let component: EnterprisesListComponent;
  let fixture: ComponentFixture<EnterprisesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterprisesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterprisesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

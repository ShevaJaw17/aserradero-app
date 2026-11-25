import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturaFormPage } from './factura-form.page';

describe('FacturaFormPage', () => {
  let component: FacturaFormPage;
  let fixture: ComponentFixture<FacturaFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

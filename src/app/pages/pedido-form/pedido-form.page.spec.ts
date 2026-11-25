import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoFormPage } from './pedido-form.page';

describe('PedidoFormPage', () => {
  let component: PedidoFormPage;
  let fixture: ComponentFixture<PedidoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduccionFormPage } from './produccion-form.page';

describe('ProduccionFormPage', () => {
  let component: ProduccionFormPage;
  let fixture: ComponentFixture<ProduccionFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

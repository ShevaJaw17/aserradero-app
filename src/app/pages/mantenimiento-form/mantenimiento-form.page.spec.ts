import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MantenimientoFormPage } from './mantenimiento-form.page';

describe('MantenimientoFormPage', () => {
  let component: MantenimientoFormPage;
  let fixture: ComponentFixture<MantenimientoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

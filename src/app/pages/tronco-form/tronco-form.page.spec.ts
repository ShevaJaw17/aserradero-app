import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TroncoFormPage } from './tronco-form.page';

describe('TroncoFormPage', () => {
  let component: TroncoFormPage;
  let fixture: ComponentFixture<TroncoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TroncoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TroncosPage } from './troncos.page';

describe('TroncosPage', () => {
  let component: TroncosPage;
  let fixture: ComponentFixture<TroncosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TroncosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

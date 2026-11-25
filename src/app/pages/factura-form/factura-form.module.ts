import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FacturaFormPageRoutingModule } from './factura-form-routing.module';

import { FacturaFormPage } from './factura-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturaFormPageRoutingModule
  ],
  declarations: [FacturaFormPage]
})
export class FacturaFormPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { PedidoFormPageRoutingModule } from './pedido-form-routing.module';

import { PedidoFormPage } from './pedido-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PedidoFormPageRoutingModule
  ],
  declarations: [PedidoFormPage]
})
export class PedidoFormPageModule {}

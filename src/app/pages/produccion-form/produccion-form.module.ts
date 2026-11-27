import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ProduccionFormPageRoutingModule } from './produccion-form-routing.module';

import { ProduccionFormPage } from './produccion-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProduccionFormPageRoutingModule
  ],
  declarations: [ProduccionFormPage]
})
export class ProduccionFormPageModule {}

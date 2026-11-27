import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { TroncoFormPageRoutingModule } from './tronco-form-routing.module';

import { TroncoFormPage } from './tronco-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TroncoFormPageRoutingModule
  ],
  declarations: [TroncoFormPage]
})
export class TroncoFormPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ProduccionPageRoutingModule } from './produccion-routing.module';

import { ProduccionPage } from './produccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProduccionPageRoutingModule
  ],
  declarations: [ProduccionPage]
})
export class ProduccionPageModule {}

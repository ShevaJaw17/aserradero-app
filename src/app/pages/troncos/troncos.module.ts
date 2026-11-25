import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { TroncosPageRoutingModule } from './troncos-routing.module';

import { TroncosPage } from './troncos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TroncosPageRoutingModule
  ],
  declarations: [TroncosPage]
})
export class TroncosPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { MantenimientoFormPageRoutingModule } from './mantenimiento-form-routing.module';

import { MantenimientoFormPage } from './mantenimiento-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MantenimientoFormPageRoutingModule
  ],
  declarations: [MantenimientoFormPage]
})
export class MantenimientoFormPageModule {}

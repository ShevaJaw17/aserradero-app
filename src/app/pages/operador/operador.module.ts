import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { OperadorPageRoutingModule } from './operador-routing.module';
import { OperadorPage } from './operador.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, OperadorPageRoutingModule],
  declarations: [OperadorPage],
})
export class OperadorPageModule {}

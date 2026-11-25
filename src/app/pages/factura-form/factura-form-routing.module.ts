import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturaFormPage } from './factura-form.page';

const routes: Routes = [
  {
    path: '',
    component: FacturaFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturaFormPageRoutingModule {}

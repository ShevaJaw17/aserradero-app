import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoFormPage } from './mantenimiento-form.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientoFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientoFormPageRoutingModule {}

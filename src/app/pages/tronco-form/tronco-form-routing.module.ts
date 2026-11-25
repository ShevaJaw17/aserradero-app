import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TroncoFormPage } from './tronco-form.page';

const routes: Routes = [
  {
    path: '',
    component: TroncoFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TroncoFormPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TroncosPage } from './troncos.page';

const routes: Routes = [
  {
    path: '',
    component: TroncosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TroncosPageRoutingModule {}

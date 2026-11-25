import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'troncos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/troncos/troncos.module').then( m => m.TroncosPageModule)
  },
  {
    path: 'tronco-form',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/tronco-form/tronco-form.module').then( m => m.TroncoFormPageModule)
  },
  {
    path: 'produccion',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/produccion/produccion.module').then( m => m.ProduccionPageModule)
  },
  {
    path: 'produccion-form',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/produccion-form/produccion-form.module').then( m => m.ProduccionFormPageModule)
  },
  {
    path: 'pedidos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'pedido-form',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pedido-form/pedido-form.module').then( m => m.PedidoFormPageModule)
  },
  {
    path: 'facturacion',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/facturacion/facturacion.module').then( m => m.FacturacionPageModule)
  },
  {
    path: 'factura-form',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/factura-form/factura-form.module').then( m => m.FacturaFormPageModule)
  },
  {
    path: 'mantenimiento',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/mantenimiento/mantenimiento.module').then( m => m.MantenimientoPageModule)
  },
  {
    path: 'mantenimiento-form',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/mantenimiento-form/mantenimiento-form.module').then( m => m.MantenimientoFormPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, bindToComponentInputs: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RoleGuard } from './guards/role.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'troncos',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/troncos/troncos.module').then( m => m.TroncosPageModule)
  },
  {
    path: 'tronco-form',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/tronco-form/tronco-form.module').then( m => m.TroncoFormPageModule)
  },
  {
    path: 'produccion',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/produccion/produccion.module').then( m => m.ProduccionPageModule)
  },
  {
    path: 'produccion-form',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/produccion-form/produccion-form.module').then( m => m.ProduccionFormPageModule)
  },
  {
    path: 'pedidos',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'pedido-form',
    canActivate: [RoleGuard],
    loadChildren: () => import('./pages/pedido-form/pedido-form.module').then( m => m.PedidoFormPageModule)
  },
  {
    path: 'facturacion',
    canActivate: [RoleGuard],
    data: { roles: ['jefe', 'admin'] },
    loadChildren: () => import('./pages/facturacion/facturacion.module').then( m => m.FacturacionPageModule)
  },
  {
    path: 'factura-form',
    canActivate: [RoleGuard],
    data: { roles: ['jefe', 'admin'] },
    loadChildren: () => import('./pages/factura-form/factura-form.module').then( m => m.FacturaFormPageModule)
  },
  {
    path: 'mantenimiento',
    canActivate: [RoleGuard],
    data: { roles: ['jefe', 'admin'] },
    loadChildren: () => import('./pages/mantenimiento/mantenimiento.module').then( m => m.MantenimientoPageModule)
  },
  {
    path: 'mantenimiento-form',
    canActivate: [RoleGuard],
    data: { roles: ['jefe', 'admin'] },
    loadChildren: () => import('./pages/mantenimiento-form/mantenimiento-form.module').then( m => m.MantenimientoFormPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'operador',
    canActivate: [RoleGuard],
    data: { roles: ['operador', 'jefe', 'admin'], maquina: 'despuntador' },
    loadChildren: () => import('./pages/operador/operador.module').then( m => m.OperadorPageModule)
  },
  {
    path: 'despuntador',
    canActivate: [RoleGuard],
    data: { roles: ['operador', 'jefe', 'admin'], maquina: 'despuntador' },
    loadChildren: () => import('./pages/operador/operador.module').then( m => m.OperadorPageModule)
  },
  {
    path: 'bicelador',
    canActivate: [RoleGuard],
    data: { roles: ['operador', 'jefe', 'admin'], maquina: 'bicelador' },
    loadChildren: () => import('./pages/operador/operador.module').then( m => m.OperadorPageModule)
  },
  {
    path: 'mesa-tacos',
    canActivate: [RoleGuard],
    data: { roles: ['operador', 'jefe', 'admin'], maquina: 'mesa_tacos' },
    loadChildren: () => import('./pages/operador/operador.module').then( m => m.OperadorPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, bindToComponentInputs: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

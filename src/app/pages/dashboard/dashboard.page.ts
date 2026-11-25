import { Component } from '@angular/core';
import { TroncoService } from '../../services/tronco.service';
import { ProduccionService } from '../../services/produccion.service';
import { PedidoService } from '../../services/pedido.service';
import { FacturaService } from '../../services/factura.service';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { SyncService } from '../../services/sync.service';
import { CloudSyncService } from '../../services/cloud-sync.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  syncMsg = '';

  constructor(
    public troncos: TroncoService,
    public produccion: ProduccionService,
    public pedidos: PedidoService,
    public facturas: FacturaService,
    public mantenimientos: MantenimientoService,
    public sync: SyncService,
    public cloud: CloudSyncService,
    public auth: AuthService
  ) {}

  async sincronizar(): Promise<void> {
    this.syncMsg = 'Sincronizando...';
    const res = await this.cloud.syncAll();
    this.syncMsg = res.message;
    setTimeout(() => (this.syncMsg = ''), 3000);
  }
}

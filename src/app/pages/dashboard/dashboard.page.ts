import { Component } from '@angular/core';
import { TroncoService } from '../../services/tronco.service';
import { ProduccionService } from '../../services/produccion.service';
import { PedidoService } from '../../services/pedido.service';
import { FacturaService } from '../../services/factura.service';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { SyncService } from '../../services/sync.service';
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
    public auth: AuthService
  ) {}

  async sincronizar(): Promise<void> {
    const pending = this.troncos.pendientesSync();
    const ids = pending.map((t) => t.id);
    const res = await this.sync.syncPending(async () => {
      // Aqui se enviarian los registros al backend real.
      return ids.length;
    });
    if (res.ok) {
      this.troncos.marcarSincronizados(ids);
      this.syncMsg = `Sincronizados ${res.sent} troncos`;
    } else {
      this.syncMsg = 'Error al sincronizar';
    }
    setTimeout(() => (this.syncMsg = ''), 3000);
  }
}

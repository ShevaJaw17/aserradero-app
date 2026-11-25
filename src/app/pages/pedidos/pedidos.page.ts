import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../models/pedido.model';

@Component({
  standalone: false,
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage {
  filtro: EstadoPedido | 'todos' = 'todos';

  constructor(public svc: PedidoService, private alert: AlertController) {}

  get lista(): Pedido[] {
    const all = this.svc.getAll();
    if (this.filtro === 'todos') return all;
    return all.filter((p) => p.estado === this.filtro);
  }

  estadoColor(e: EstadoPedido): string {
    switch (e) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'primary';
      case 'entregado': return 'success';
      case 'cancelado': return 'medium';
    }
  }

  estadoLabel(e: EstadoPedido): string {
    return e.replace('_', ' ');
  }

  async cambiarEstado(p: Pedido, estado: EstadoPedido): Promise<void> {
    this.svc.cambiarEstado(p.id, estado);
  }

  async eliminar(p: Pedido): Promise<void> {
    const a = await this.alert.create({
      header: 'Eliminar pedido',
      message: `¿Eliminar ${p.numero}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.svc.remove(p.id) },
      ],
    });
    await a.present();
  }
}

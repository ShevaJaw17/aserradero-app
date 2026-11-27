import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FacturaService } from '../../services/factura.service';
import { Factura, EstadoFactura } from '../../models/factura.model';

@Component({
  standalone: false,
  selector: 'app-facturacion',
  templateUrl: './facturacion.page.html',
  styleUrls: ['./facturacion.page.scss'],
})
export class FacturacionPage {
  pageSize = 50;
  shown = 50;

  constructor(public svc: FacturaService, private alert: AlertController) {}

  get lista(): Factura[] {
    return this.svc.getAll().slice(0, this.shown);
  }

  get hasMore(): boolean {
    return this.shown < this.svc.getAll().length;
  }

  loadMore(ev: any): void {
    this.shown += this.pageSize;
    ev.target.complete();
  }

  estadoColor(e: EstadoFactura): string {
    switch (e) {
      case 'pendiente': return 'warning';
      case 'pagada': return 'success';
      case 'anulada': return 'medium';
    }
  }

  async cambiarEstado(f: Factura, estado: EstadoFactura): Promise<void> {
    this.svc.cambiarEstado(f.id, estado);
  }

  async eliminar(f: Factura): Promise<void> {
    const a = await this.alert.create({
      header: 'Eliminar factura',
      message: `¿Eliminar ${f.numero}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.svc.remove(f.id) },
      ],
    });
    await a.present();
  }
}

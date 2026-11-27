import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TroncoService } from '../../services/tronco.service';
import { Tronco, EstadoTronco } from '../../models/tronco.model';

@Component({
  standalone: false,
  selector: 'app-troncos',
  templateUrl: './troncos.page.html',
  styleUrls: ['./troncos.page.scss'],
})
export class TroncosPage {
  filtro: EstadoTronco | 'todos' = 'todos';
  pageSize = 50;
  shown = 50;

  constructor(public svc: TroncoService, private alert: AlertController) {}

  get lista(): Tronco[] {
    const all = this.svc.getAll();
    const filtered = this.filtro === 'todos' ? all : all.filter((t) => t.estado === this.filtro);
    return filtered.slice(0, this.shown);
  }

  get hasMore(): boolean {
    const all = this.svc.getAll();
    const filtered = this.filtro === 'todos' ? all : all.filter((t) => t.estado === this.filtro);
    return this.shown < filtered.length;
  }

  loadMore(ev: any): void {
    this.shown += this.pageSize;
    ev.target.complete();
  }

  estadoColor(e: EstadoTronco): string {
    switch (e) {
      case 'en_patio': return 'primary';
      case 'en_proceso': return 'warning';
      case 'procesado': return 'success';
      case 'vendido': return 'medium';
    }
  }

  estadoLabel(e: EstadoTronco): string {
    return e.replace('_', ' ');
  }

  async eliminar(t: Tronco): Promise<void> {
    const a = await this.alert.create({
      header: 'Eliminar tronco',
      message: `¿Eliminar ${t.especie} (${t.volumenM3} m³)?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.svc.remove(t.id) },
      ],
    });
    await a.present();
  }
}

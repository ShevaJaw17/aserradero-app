import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProduccionService } from '../../services/produccion.service';
import { Produccion } from '../../models/produccion.model';

@Component({
  standalone: false,
  selector: 'app-produccion',
  templateUrl: './produccion.page.html',
  styleUrls: ['./produccion.page.scss'],
})
export class ProduccionPage {
  pageSize = 50;
  shown = 50;

  constructor(public svc: ProduccionService, private alert: AlertController) {}

  get lista(): Produccion[] {
    return this.svc.getAll().slice(0, this.shown);
  }

  get hasMore(): boolean {
    return this.shown < this.svc.getAll().length;
  }

  loadMore(ev: any): void {
    this.shown += this.pageSize;
    ev.target.complete();
  }

  tipoLabel(t: string): string {
    const map: any = { tabla: 'Tabla', viga: 'Viga', vigueta: 'Vigueta', liston: 'Listón', otro: 'Otro' };
    return map[t] || t;
  }

  async eliminar(p: Produccion): Promise<void> {
    const a = await this.alert.create({
      header: 'Eliminar producción',
      message: `¿Eliminar ${p.tipo} ${p.espesorCm}x${p.anchoCm}x${p.largoM}m?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.svc.remove(p.id) },
      ],
    });
    await a.present();
  }
}

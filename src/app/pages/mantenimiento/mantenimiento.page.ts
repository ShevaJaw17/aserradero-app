import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento, EstadoMantenimiento } from '../../models/mantenimiento.model';

@Component({
  standalone: false,
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.page.html',
  styleUrls: ['./mantenimiento.page.scss'],
})
export class MantenimientoPage {
  constructor(public svc: MantenimientoService, private alert: AlertController) {}

  get lista(): Mantenimiento[] {
    return this.svc.getAll();
  }

  tipoLabel(t: string): string {
    return t === 'preventivo' ? 'Preventivo' : 'Correctivo';
  }

  estadoColor(e: EstadoMantenimiento): string {
    switch (e) {
      case 'programado': return 'warning';
      case 'en_proceso': return 'primary';
      case 'completado': return 'success';
    }
  }

  async cambiarEstado(m: Mantenimiento, estado: EstadoMantenimiento): Promise<void> {
    this.svc.cambiarEstado(m.id, estado);
  }

  async eliminar(m: Mantenimiento): Promise<void> {
    const a = await this.alert.create({
      header: 'Eliminar mantenimiento',
      message: `¿Eliminar ${m.maquina}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.svc.remove(m.id) },
      ],
    });
    await a.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento, TipoMantenimiento, EstadoMantenimiento } from '../../models/mantenimiento.model';

@Component({
  standalone: false,
  selector: 'app-mantenimiento-form',
  templateUrl: './mantenimiento-form.page.html',
  styleUrls: ['./mantenimiento-form.page.scss'],
})
export class MantenimientoFormPage implements OnInit {
  id: string | null = null;
  maquina = '';
  tipo: TipoMantenimiento = 'preventivo';
  fecha = new Date().toISOString();
  descripcion = '';
  responsable = '';
  costo: number | null = 0;
  proximoServicio = '';
  estado: EstadoMantenimiento = 'programado';

  constructor(
    private svc: MantenimientoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const m = this.svc.getAll().find((x) => x.id === this.id);
      if (m) {
        this.maquina = m.maquina; this.tipo = m.tipo; this.fecha = m.fecha;
        this.descripcion = m.descripcion; this.responsable = m.responsable;
        this.costo = m.costo; this.proximoServicio = m.proximoServicio || '';
        this.estado = m.estado;
      }
    }
  }

  guardar(): void {
    if (!this.maquina || !this.descripcion) return;
    const data = {
      maquina: this.maquina,
      tipo: this.tipo,
      fecha: this.fecha,
      descripcion: this.descripcion,
      responsable: this.responsable,
      costo: this.costo || 0,
      proximoServicio: this.proximoServicio || undefined,
      estado: this.estado,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/mantenimiento');
  }
}

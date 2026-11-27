import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: MantenimientoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      maquina: ['', Validators.required],
      tipo: ['preventivo' as TipoMantenimiento, Validators.required],
      fecha: [new Date().toISOString()],
      descripcion: ['', Validators.required],
      responsable: [''],
      costo: [0, [Validators.min(0)]],
      proximoServicio: [''],
      estado: ['programado' as EstadoMantenimiento, Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const m = this.svc.getAll().find((x) => x.id === this.id);
      if (m) {
        this.form.patchValue({
          maquina: m.maquina,
          tipo: m.tipo,
          fecha: m.fecha,
          descripcion: m.descripcion,
          responsable: m.responsable,
          costo: m.costo,
          proximoServicio: m.proximoServicio || '',
          estado: m.estado,
        });
      }
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const data: Omit<Mantenimiento, 'id' | 'sincronizado'> = {
      maquina: v.maquina,
      tipo: v.tipo,
      fecha: v.fecha,
      descripcion: v.descripcion,
      responsable: v.responsable,
      costo: v.costo || 0,
      proximoServicio: v.proximoServicio || undefined,
      estado: v.estado,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/mantenimiento');
  }
}

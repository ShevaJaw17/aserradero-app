import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary', duration = 2500): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration, color, position: 'bottom' });
    await toast.present();
  }

  success(message: string): Promise<void> { return this.show(message, 'success'); }
  error(message: string): Promise<void> { return this.show(message, 'danger'); }
  warning(message: string): Promise<void> { return this.show(message, 'warning'); }
}

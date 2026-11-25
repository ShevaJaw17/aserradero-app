import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ionViewWillEnter(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    }
  }

  login(): void {
    this.error = '';
    this.loading = true;
    const ok = this.auth.login(this.usuario.trim(), this.password);
    this.loading = false;
    if (ok) {
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }
}

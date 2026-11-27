import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return false;
    }
    const roles = route.data?.['roles'] as string[] | undefined;
    if (roles && roles.length && !this.auth.hasRole(roles as any)) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}

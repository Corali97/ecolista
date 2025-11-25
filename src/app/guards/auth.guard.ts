import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      })
    );
  }
}

export const AuthGuard: CanActivateFn = () => {
  const guard = inject(AuthGuardService);
  return guard.canActivate();
};

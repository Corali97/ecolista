import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.session$.pipe(
      map((session) =>
        session ? true : this.router.createUrlTree(['/login'], { queryParams: { redirect: '/home' } })
      )
    );
  }
}

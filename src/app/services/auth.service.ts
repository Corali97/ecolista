import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { StorageService } from './storage.service';

export interface Session {
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly sessionKey = 'session';
  private readonly validCredentials = [
    { email: 'admin@ecolista.com', password: '1234' },
    { email: 'coralirodriguez1997@gmail.com', password: '123456' },
  ] as const;

  private readonly sessionSubject = new BehaviorSubject<Session | null>(null);
  readonly session$: Observable<Session | null> = this.sessionSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.session$.pipe(map((session) => session !== null));

  private redirectUrl?: string;

  async init(): Promise<void> {
    const stored = await this.storage.get<Session>(this.sessionKey);
    if (stored) {
      this.sessionSubject.next(stored);
    }
  }

  login(email: string, password: string): Observable<Session> {
    if (!this.isValidCredentials(email, password)) {
      return throwError(() => new Error('INVALID_CREDENTIALS'));
    }

    const session: Session = {
      email,
      token: btoa(`${email}:${password}:${Date.now()}`),
    };

    return this.api.createProduct({
      id: 0,
      name: 'Inicio de sesión',
      category: 'Sistema',
      quantity: 0,
      unit: 'u',
      expiry: new Date().toISOString().split('T')[0],
      priority: 'Media',
      purchased: true,
      ecoScore: 100,
      notes: 'Evento de autenticación',
    }).pipe(
      tap(async () => {
        this.sessionSubject.next(session);
        await this.storage.set(this.sessionKey, session);
      }),
      map(() => session)
    );
  }

  private isValidCredentials(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return this.validCredentials.some(
      (credentials) => credentials.email === normalizedEmail && credentials.password === password
    );
  }

  async logout(): Promise<void> {
    this.sessionSubject.next(null);
    await this.storage.remove(this.sessionKey);
    await this.router.navigateByUrl('/login');
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  consumeRedirectUrl(): string | undefined {
    const url = this.redirectUrl;
    this.redirectUrl = undefined;
    return url;
  }

  get currentSession(): Session | null {
    return this.sessionSubject.value;
  }
}

<<<<<<< ours
import { Injectable } from '@angular/core';
<<<<<<< ours
import { BehaviorSubject, map, Observable } from 'rxjs';

import { StorageService } from './storage.service';

export interface SessionData {
  email: string;
  token: string;
  createdAt: number;
=======
import { BehaviorSubject } from 'rxjs';

interface AuthState {
  email: string;
  loggedAt: string;
  token: string;
>>>>>>> theirs
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
<<<<<<< ours
  private readonly storageKey = 'session';
  private readonly sessionSubject = new BehaviorSubject<SessionData | null>(null);

  readonly session$ = this.sessionSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.session$.pipe(map((session) => !!session?.token));

  constructor(private readonly storageService: StorageService) {
    this.restoreSession();
  }

  async login(email: string): Promise<void> {
    const session: SessionData = {
      email,
      token: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    await this.storageService.set(this.storageKey, session);
    this.sessionSubject.next(session);
  }

  async logout(): Promise<void> {
    await this.storageService.remove(this.storageKey);
    this.sessionSubject.next(null);
  }

  private async restoreSession(): Promise<void> {
    const stored = await this.storageService.get<SessionData>(this.storageKey);
=======
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

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

  private readonly sessionSubject = new BehaviorSubject<Session | null>(null);
  readonly session$: Observable<Session | null> = this.sessionSubject.asObservable();
  readonly isLoggedIn$: Observable<boolean> = this.session$.pipe(map((session) => session !== null));

  async init(): Promise<void> {
    const stored = await this.storage.get<Session>(this.sessionKey);
>>>>>>> theirs
    if (stored) {
      this.sessionSubject.next(stored);
    }
  }
<<<<<<< ours
=======
  private readonly storageKey = 'ecolista-auth';
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly userSubject = new BehaviorSubject<AuthState | null>(null);
  private redirectUrl?: string;

  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  async login(email: string, password: string): Promise<boolean> {
    const credentialsAreValid = this.areCredentialsValid(email, password);

    if (!credentialsAreValid) {
      return false;
    }

    const authState: AuthState = {
      email,
      loggedAt: new Date().toISOString(),
      token: btoa(`${email}:${password}`),
    };

    this.persist(authState);
    this.isAuthenticatedSubject.next(true);
    this.userSubject.next(authState);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  consumeRedirectUrl(): string | undefined {
    const url = this.redirectUrl;
    this.redirectUrl = undefined;
    return url;
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as AuthState;
      this.userSubject.next(parsed);
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('No se pudo restaurar la sesión guardada', error);
    }
  }

  private persist(state: AuthState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private areCredentialsValid(email: string, password: string): boolean {
    const emailPattern = /@.+\./;
    const passwordValid = password.trim().length >= 6;
    return emailPattern.test(email) && passwordValid;
  }
>>>>>>> theirs
=======

  login(email: string, password: string): Observable<Session> {
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
      })
    );
  }

  async logout(): Promise<void> {
    this.sessionSubject.next(null);
    await this.storage.remove(this.sessionKey);
    await this.router.navigateByUrl('/login');
  }

  get currentSession(): Session | null {
    return this.sessionSubject.value;
  }
>>>>>>> theirs
}

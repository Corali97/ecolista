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
    if (stored) {
      this.sessionSubject.next(stored);
    }
  }
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
}

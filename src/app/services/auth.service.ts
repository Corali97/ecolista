import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { StorageService } from './storage.service';

export interface SessionData {
  email: string;
  token: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}

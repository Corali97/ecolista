import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, map, tap } from 'rxjs';

export interface EcoTip {
  id: number;
  author: string;
  quote: string;
}

export interface TipsResponse {
  tips: EcoTip[];
  fromCache: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EcoTipsService {
  private readonly http = inject(HttpClient);
  private readonly cacheKey = 'ecolista-tips';
  private readonly endpoint = 'https://dummyjson.com/quotes?limit=5';
  private readonly tipsSubject = new BehaviorSubject<TipsResponse>({
    tips: [],
    fromCache: true,
    message: 'Sin datos. Actualiza para traer consejos sostenibles.',
  });

  readonly tips$ = this.tipsSubject.asObservable();

  constructor() {
    this.refreshTips();
  }

  refreshTips(): void {
    this.fetchTips().subscribe((response) => this.tipsSubject.next(response));
  }

  async getCachedTipsSnapshot(): Promise<EcoTip[]> {
    return this.readFromCache();
  }

  private fetchTips(): Observable<TipsResponse> {
    return this.http.get<{ quotes: EcoTip[] }>(this.endpoint).pipe(
      map((response) => ({
        tips: response.quotes,
        fromCache: false,
        message: 'Consejos actualizados desde la API REST.',
      })),
      tap(({ tips }) => this.persistToCache(tips)),
      catchError(() =>
        from(this.readFromCache()).pipe(
          map((tips) => ({
            tips,
            fromCache: true,
            message: tips.length
              ? 'No hay conexión (404/offline). Mostrando consejos guardados localmente.'
              : 'No hay datos en cache y la API no respondió.',
          }))
        )
      )
    );
  }

  private async persistToCache(tips: EcoTip[]): Promise<void> {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(tips));
    } catch (error) {
      console.warn('No se pudo guardar la cache de consejos.', error);
    }
  }

  private async readFromCache(): Promise<EcoTip[]> {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      return stored ? (JSON.parse(stored) as EcoTip[]) : [];
    } catch (error) {
      console.warn('No se pudo leer la cache de consejos.', error);
      return [];
    }
  }
}

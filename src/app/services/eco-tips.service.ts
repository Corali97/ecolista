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
  private readonly maxTips = 5;
  private readonly spanishTips: EcoTip[] = [
    {
      id: 1,
      author: 'Equipo EcoLista',
      quote: 'Planifica tus comidas para aprovechar al máximo cada ingrediente y reducir el desperdicio.',
    },
    {
      id: 2,
      author: 'EcoLista',
      quote: 'Compra a granel siempre que puedas y lleva tus propios envases reutilizables.',
    },
    {
      id: 3,
      author: 'Consejo sostenible',
      quote: 'Congela porciones pequeñas de frutas o verduras maduras para usarlas en batidos o sopas.',
    },
    {
      id: 4,
      author: 'EcoLista',
      quote: 'Organiza tu refrigerador usando el método "primero en entrar, primero en salir" para evitar olvidos.',
    },
    {
      id: 5,
      author: 'Equipo EcoLista',
      quote: 'Prefiere productos locales y de temporada para reducir la huella de transporte.',
    },
  ];
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
        tips: this.withSpanishTips(this.sanitizeTips(response.quotes)),
        fromCache: false,
        message: 'Consejos actualizados para tu EcoLista.',
      })),
      tap(({ tips }) => this.persistToCache(tips)),
      catchError(() =>
        from(this.readFromCache()).pipe(
          map((tips) => ({
            tips: this.withSpanishTips(this.sanitizeTips(tips)),
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
      localStorage.setItem(this.cacheKey, JSON.stringify(this.sanitizeTips(tips)));
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

  private sanitizeTips(tips: EcoTip[]): EcoTip[] {
    const uniqueByQuote = new Map<string, EcoTip>();

    tips.forEach((tip) => {
      const normalizedQuote = (tip.quote ?? `${tip.id}`).trim().toLowerCase();
      if (!uniqueByQuote.has(normalizedQuote)) {
        uniqueByQuote.set(normalizedQuote, tip);
      }
    });

    return Array.from(uniqueByQuote.values()).slice(0, this.maxTips);
  }

  private withSpanishTips(tips: EcoTip[]): EcoTip[] {
    if (!tips.length) {
      return this.sanitizeTips(this.spanishTips);
    }

    return tips.map((tip, index) => {
      const localized = this.spanishTips[index % this.spanishTips.length];
      return {
        ...tip,
        author: localized.author,
        quote: localized.quote,
      };
    });
  }
}

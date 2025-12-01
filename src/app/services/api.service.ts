import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { StorageService } from './storage.service';

interface ApiProduct {
  id?: number;
  title: string;
  body?: string;
  userId?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly cacheKey = 'cachedProducts';

  readonly offlineFallback$ = new BehaviorSubject(false);

  fetchProducts(): Observable<Product[]> {
    return this.http.get<ApiProduct[]>(`${environment.apiUrl}/posts`).pipe(
      map((items) =>
        items.slice(0, 5).map((item, index) => ({
          id: item.id ?? index,
          name: item.title,
          category: 'Despensa',
          quantity: 1,
          unit: 'u',
          expiry: this.formatDateOffset(3 + index),
          priority: index % 2 === 0 ? 'Alta' : 'Media',
          purchased: false,
          ecoScore: 70 + index,
          notes: item.body,
        }))
      ),
      tap((products) => this.storage.set(this.cacheKey, products)),
      tap(() => this.offlineFallback$.next(false)),
      catchError((error) => this.handleError(error))
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<ApiProduct>(`${environment.apiUrl}/posts`, product).pipe(
      map((response) => ({ ...product, id: response.id ?? product.id })),
      tap(async (created) => {
        const cached = (await this.storage.get<Product[]>(this.cacheKey)) ?? [];
        await this.storage.set(this.cacheKey, [...cached, created]);
      }),
      tap(() => this.offlineFallback$.next(false)),
      catchError((error) => this.handleError(error, product))
    );
  }

  private formatDateOffset(daysFromToday: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().split('T')[0];
  }

  private handleError(error: unknown, fallbackItem?: Product): Observable<any> {
    console.error('API error', error);
    return from(this.storage.get<Product[]>(this.cacheKey)).pipe(
      switchMap((cached) => {
        if (cached?.length) {
          this.offlineFallback$.next(true);
          return of(cached);
        }
        if (fallbackItem) {
          this.offlineFallback$.next(true);
          return of(fallbackItem);
        }
        return throwError(() => error);
      })
    );
  }
}

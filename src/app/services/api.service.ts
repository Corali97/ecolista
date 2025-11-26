import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< ours
import { map, Observable } from 'rxjs';

import { Product } from '../models/product';

interface ApiProduct {
  id: number;
  title: string;
  category: string;
  stock: number;
  rating?: number;
  description?: string;
}

interface ApiResponse {
  products: ApiProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'https://dummyjson.com/products?limit=6';

  constructor(private readonly http: HttpClient) {}

  fetchProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(map((response) => this.mapProducts(response.products)));
  }

  private mapProducts(products: ApiProduct[]): Product[] {
    const today = new Date();

    return products.map((product, index) => {
      const expiry = new Date(today);
      expiry.setDate(today.getDate() + (index + 2));

      return {
        id: product.id,
        name: product.title,
        category: product.category,
        quantity: Math.max(1, Math.round(product.stock / 5)),
        unit: 'unidades',
        expiry: expiry.toISOString().split('T')[0],
        priority: product.rating && product.rating > 4.4 ? 'Alta' : product.rating && product.rating > 4 ? 'Media' : 'Baja',
        purchased: false,
        ecoScore: Math.min(100, Math.round((product.rating ?? 4) * 18)),
        notes: product.description,
      } satisfies Product;
    });
=======
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
  private readonly cacheKey = 'cachedProducts';

  readonly offlineFallback$ = new BehaviorSubject(false);

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService
  ) {}

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
>>>>>>> theirs
  }
}

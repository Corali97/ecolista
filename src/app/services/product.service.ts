import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, firstValueFrom } from 'rxjs';

import { Product } from '../models/product';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

interface CreateProductInput {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry: string;
  priority: 'Alta' | 'Media' | 'Baja';
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly syncStatusSubject = new BehaviorSubject<{ message: string; offline: boolean } | null>(null);

  private idCounter = 1;

  readonly products$ = this.productsSubject.asObservable();
  readonly syncStatus$ = this.syncStatusSubject.asObservable();

  constructor(
    private readonly apiService: ApiService,
    private readonly storageService: StorageService
  ) {
    this.restoreProducts();
  }

  addProduct(input: CreateProductInput): void {
    const newProduct: Product = {
      id: this.idCounter++,
      ecoScore: this.generateEcoScore(input.category),
      purchased: false,
      ...input,
    };

    const updated = [...this.productsSubject.value, newProduct];
    this.productsSubject.next(updated);
    void this.persistProducts();
  }

  markAsPurchased(id: number, purchased: boolean): void {
    const updated = this.productsSubject.value.map((product) =>
      product.id === id ? { ...product, purchased } : product
    );
    this.productsSubject.next(updated);
    void this.persistProducts();
  }

  getProductById$(id: number): Observable<Product | undefined> {
    return this.products$.pipe(map((products) => products.find((product) => product.id === id)));
  }

  getSoonToExpire$(daysThreshold = 3): Observable<Product[]> {
    return this.products$.pipe(
      map((products) =>
        products.filter((product) => !product.purchased && this.daysUntilExpiry(product.expiry) <= daysThreshold)
      )
    );
  }

  getInventorySummary$(): Observable<{ total: number; nearExpiry: number; purchased: number }> {
    return this.products$.pipe(
      map((products) => {
        const nearExpiry = products.filter(
          (product) => !product.purchased && this.daysUntilExpiry(product.expiry) <= 3
        ).length;
        const purchased = products.filter((product) => product.purchased).length;

        return {
          total: products.length,
          nearExpiry,
          purchased,
        };
      })
    );
  }

  daysUntilExpiry(expiry: string): number {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diff = expiryDate.getTime() - today.setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  async refreshProductsFromApi(): Promise<void> {
    try {
      const products = await firstValueFrom(this.apiService.fetchProducts());
      this.productsSubject.next(products);
      this.idCounter = products.length + 1;
      await this.persistProducts();
      this.syncStatusSubject.next({ message: 'Datos sincronizados con la API.', offline: false });
    } catch (error) {
      const stored = await this.storageService.get<Product[]>('products');
      if (stored?.length) {
        this.productsSubject.next(stored);
        this.idCounter = stored.length + 1;
      }

      const offlineMessage =
        error instanceof HttpErrorResponse && error.status === 404
          ? 'La API respondió 404. Mostramos los datos guardados sin perderlos.'
          : 'No fue posible contactar la API. Se muestran los últimos datos almacenados.';

      this.syncStatusSubject.next({ message: offlineMessage, offline: true });
    }
  }

  private formatDateOffset(daysFromToday: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().split('T')[0];
  }

  private generateEcoScore(category: string): number {
    const baseScores: Record<string, number> = {
      Verduras: 90,
      Vegetales: 85,
      Frutas: 88,
      Lácteos: 75,
      Cereales: 80,
      Proteínas: 70,
    };

    const base = baseScores[category] ?? 78;
    const variation = Math.floor(Math.random() * 10) - 5;
    return Math.max(50, Math.min(100, base + variation));
  }

  private async persistProducts(): Promise<void> {
    await this.storageService.set('products', this.productsSubject.value);
  }

  private async restoreProducts(): Promise<void> {
    const stored = await this.storageService.get<Product[]>('products');
    if (stored?.length) {
      this.productsSubject.next(stored);
      this.idCounter = stored.length + 1;
      return;
    }

    const defaultProducts: Product[] = [
      {
        id: 1,
        name: 'Espinaca orgánica',
        category: 'Verduras',
        quantity: 2,
        unit: 'manojos',
        expiry: this.formatDateOffset(2),
        priority: 'Alta',
        purchased: false,
        ecoScore: 92,
        notes: 'Ideal para ensaladas frescas',
      },
      {
        id: 2,
        name: 'Tomates locales',
        category: 'Vegetales',
        quantity: 6,
        unit: 'piezas',
        expiry: this.formatDateOffset(4),
        priority: 'Media',
        purchased: false,
        ecoScore: 88,
      },
      {
        id: 3,
        name: 'Yogur artesanal',
        category: 'Lácteos',
        quantity: 4,
        unit: 'frascos',
        expiry: this.formatDateOffset(1),
        priority: 'Alta',
        purchased: true,
        ecoScore: 76,
        notes: 'Consumir en desayunos y meriendas',
      },
    ];

    this.productsSubject.next(defaultProducts);
    this.idCounter = defaultProducts.length + 1;
    await this.persistProducts();
  }
}

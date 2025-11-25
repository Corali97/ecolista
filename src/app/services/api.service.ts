import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  }
}

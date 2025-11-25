import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {
  private readonly productService = inject(ProductService);

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();

  readonly achievements = [
    {
      title: 'Héroe sin desperdicio',
      description: 'Consumiste el 80% de tus compras a tiempo durante el último mes.',
      icon: 'ribbon-outline',
    },
    {
      title: 'Comprador local',
      description: 'Priorizaste productos de cercanía en tus últimas 5 compras.',
      icon: 'bag-handle-outline',
    },
  ];

}

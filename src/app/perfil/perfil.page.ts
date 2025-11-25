import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();
  readonly session$ = this.authService.session$;

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

  async logout(): Promise<void> {
    await this.authService.logout();
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}

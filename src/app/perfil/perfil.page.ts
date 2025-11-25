import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { AuthService } from '../services/auth.service';
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
<<<<<<< ours
  private readonly router = inject(Router);

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();
  readonly session$ = this.authService.session$;
=======

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();
  readonly user$ = this.authService.user$;
  coordinates?: { latitude: number; longitude: number };
  locationMessage = '';
>>>>>>> theirs

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

<<<<<<< ours
  async logout(): Promise<void> {
    await this.authService.logout();
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.router.navigateByUrl('/login', { replaceUrl: true });
=======
  captureLocation(): void {
    this.locationMessage = 'Obteniendo ubicación desde GPS del dispositivo…';

    if (!navigator.geolocation) {
      this.locationMessage = 'El navegador no expone el GPS.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.coordinates = {
          latitude: Number(position.coords.latitude.toFixed(5)),
          longitude: Number(position.coords.longitude.toFixed(5)),
        };
        this.locationMessage = 'Ubicación capturada con el plugin de geolocalización del dispositivo.';
      },
      (error) => {
        this.locationMessage = `No se pudo obtener la ubicación: ${error.message}`;
      }
    );
  }

  logout(): void {
    this.authService.logout();
>>>>>>> theirs
  }

}

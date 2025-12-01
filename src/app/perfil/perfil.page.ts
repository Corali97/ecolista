import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Product } from '../models/product';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';
import { ProductService } from '../services/product.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly locationService = inject(LocationService);

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();
  readonly session$ = this.authService.session$;

  coordinates?: { latitude: number; longitude: number };
  locationLabel = 'Ubicación no disponible';
  isGettingLocation = false;

  avatarDataUrl: string | null = null;

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

  ionViewWillEnter(): void {
    void this.loadAvatar();
    void this.refreshLocation();
  }

  get userEmail(): string {
    return this.authService.currentSession?.email ?? 'Usuario invitado';
  }

  async captureAvatar(): Promise<void> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      this.avatarDataUrl = photo.dataUrl ?? null;
      if (this.avatarDataUrl) {
        await this.storage.set('avatar', this.avatarDataUrl);
      }
    } catch (error) {
      console.warn('Captura cancelada', error);
    }
  }

  async loadAvatar(): Promise<void> {
    this.avatarDataUrl = await this.storage.get<string>('avatar');
  }

  async refreshLocation(): Promise<void> {
    this.isGettingLocation = true;
    const location = await this.locationService.getCurrentLocation();
    this.isGettingLocation = false;
    if (location) {
      this.locationLabel = `Lat ${location.lat.toFixed(4)}, Lng ${location.lng.toFixed(4)}`;
    }
  }

  navigateToList(priority?: string): void {
    this.router.navigate(['/lista'], {
      queryParams: priority ? { priority, from: 'perfil' } : undefined,
      state: { highlight: priority },
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
<<<<<<< ours
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Router } from '@angular/router';

import { Product } from '../models/product';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
=======
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Product } from '../models/product';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';
import { ProductService } from '../services/product.service';
import { StorageService } from '../services/storage.service';
>>>>>>> theirs

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
<<<<<<< ours
  private readonly router = inject(Router);
=======
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly locationService = inject(LocationService);
>>>>>>> theirs

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

  avatarDataUrl: string | null = null;
  locationLabel = 'Ubicación no disponible';
  isGettingLocation = false;

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
=======
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
>>>>>>> theirs
  }

}

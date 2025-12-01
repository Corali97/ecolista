import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform, ToastController } from '@ionic/angular';

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
  private readonly platform = inject(Platform);
  private readonly toastController = inject(ToastController);

  @ViewChild('avatarInput', { static: false })
  private avatarInput?: ElementRef<HTMLInputElement>;

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
    if (!this.platform.is('hybrid') && !Capacitor.isNativePlatform()) {
      this.triggerFilePicker();
      return;
    }

    const permissions = await Camera.checkPermissions();
    if (permissions.camera === 'denied') {
      await this.presentToast('Activa los permisos de cámara en la configuración del dispositivo.');
      return;
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      await this.saveAvatar(photo.dataUrl ?? null);
    } catch (error) {
      console.warn('Captura cancelada o fallida, usando selección de archivo', error);
      this.triggerFilePicker();
    }
  }

  async loadAvatar(): Promise<void> {
    this.avatarDataUrl = await this.storage.get<string>('avatar');
  }

  async onAvatarFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string | null;
      await this.saveAvatar(result);
    };

    reader.readAsDataURL(file);
  }

  private triggerFilePicker(): void {
    this.avatarInput?.nativeElement.click();
  }

  private async saveAvatar(dataUrl: string | null): Promise<void> {
    this.avatarDataUrl = dataUrl;
    if (this.avatarDataUrl) {
      await this.storage.set('avatar', this.avatarDataUrl);
      await this.presentToast('Foto de perfil actualizada.');
    }
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
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

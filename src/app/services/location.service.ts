import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class LocationService {
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch (error) {
      console.warn('No se pudo obtener la ubicación', error);
      return null;
    }
  }
}

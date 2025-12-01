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

  async getLocationDetails(): Promise<{ lat: number; lng: number; commune?: string; country?: string } | null> {
    const coordinates = await this.getCurrentLocation();
    if (!coordinates) {
      return null;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ecolista-app/1.0 (https://example.com/contact)',
          },
        },
      );

      if (response.ok) {
        const data: { address?: { city?: string; town?: string; suburb?: string; state?: string; country?: string } } =
          await response.json();
        const { address } = data;
        return {
          ...coordinates,
          commune: address?.city || address?.town || address?.suburb || address?.state,
          country: address?.country,
        };
      }
    } catch (error) {
      console.warn('No se pudieron obtener los detalles de la ubicación', error);
    }

    return coordinates;
  }
}

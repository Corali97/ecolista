import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storagePrefix = 'ecolista-';

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(this.storagePrefix + key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.storagePrefix + key);
  }
}

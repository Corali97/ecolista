import { Injectable } from '@angular/core';
<<<<<<< ours

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
=======
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storageReady: Promise<void>;

  constructor(private readonly storage: Storage) {
    this.storageReady = this.storage.create().then(() => undefined);
  }

  async get<T>(key: string): Promise<T | null> {
    await this.storageReady;
    return this.storage.get(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.storageReady;
    await this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    await this.storageReady;
    await this.storage.remove(key);
>>>>>>> theirs
  }
}

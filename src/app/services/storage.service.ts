import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage);
  private readonly storageReady: Promise<void> = this.storage.create().then(() => undefined);

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
  }
}

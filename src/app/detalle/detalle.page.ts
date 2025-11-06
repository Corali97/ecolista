import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage {
  readonly product$: Observable<Product | undefined> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.productService.getProductById$(id))
  );

  readonly suggestions$: Observable<Product[]> = this.productService.products$.pipe(
    map((products) => products.filter((product) => product.priority === 'Alta').slice(0, 3))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly alertController: AlertController
  ) {}

  daysUntil(expiry: string): number {
    return this.productService.daysUntilExpiry(expiry);
  }

  togglePurchased(product: Product): void {
    this.productService.markAsPurchased(product.id, !product.purchased);
  }

  async remindLater(product: Product): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Recordatorio activado',
      message: `Te avisaremos para consumir ${product.name} antes de ${product.expiry}.`,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}

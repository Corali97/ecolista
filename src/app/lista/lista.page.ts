import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AnimationController, ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: false,
})
export class ListaPage {
  @ViewChild('formCard', { read: ElementRef }) formCard?: ElementRef<HTMLIonCardElement>;

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly toastController = inject(ToastController);
  private readonly animationCtrl = inject(AnimationController);

  readonly products$: Observable<Product[]> = this.productService.products$;
  readonly soonToExpire$: Observable<Product[]> = this.productService.getSoonToExpire$();
  readonly syncStatus$ = this.productService.syncStatus$;

  readonly productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['Verduras', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unit: ['unidades', Validators.required],
    expiry: ['', Validators.required],
    priority: ['Alta', Validators.required],
    notes: [''],
  });

  ionViewDidEnter(): void {
    this.playScaleAnimation();
  }

  ionViewWillEnter(): void {
    void this.productService.refreshProductsFromApi();
  }

  syncFromApi(): void {
    void this.productService.refreshProductsFromApi();
  }

  async addProduct(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    this.productService.addProduct({
      ...value,
      priority: value.priority as 'Alta' | 'Media' | 'Baja',
      quantity: Number(value.quantity),
    });

    this.productForm.reset({
      name: '',
      category: 'Verduras',
      quantity: 1,
      unit: 'unidades',
      expiry: '',
      priority: 'Alta',
      notes: '',
    });

    const toast = await this.toastController.create({
      message: 'Producto añadido a tu EcoLista ecológica.',
      duration: 1500,
      color: 'success',
      icon: 'leaf',
    });
    await toast.present();

    await Haptics.impact({ style: ImpactStyle.Light });

    this.playScaleAnimation();
  }

  togglePurchased(product: Product): void {
    this.productService.markAsPurchased(product.id, !product.purchased);
    void Haptics.impact({ style: ImpactStyle.Medium });
  }

  getPriorityColor(product: Product): string {
    switch (product.priority) {
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warning';
      default:
        return 'tertiary';
    }
  }

  daysUntilExpiry(product: Product): number {
    return this.productService.daysUntilExpiry(product.expiry);
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  private playScaleAnimation(): void {
    if (!this.formCard) {
      return;
    }

    this.animationCtrl
      .create()
      .addElement(this.formCard.nativeElement)
      .duration(450)
      .fromTo('transform', 'scale(0.96)', 'scale(1)')
      .fromTo('opacity', '0.85', '1')
      .easing('ease-out')
      .play();
  }
}

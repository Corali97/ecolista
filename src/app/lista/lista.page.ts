import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, finalize, map, Observable } from 'rxjs';
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
  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly offline$ = this.productService.offline$;
  readonly loading$ = this.productService.loading$;
  readonly syncError$ = this.productService.syncError$;
  readonly products$: Observable<Product[]> = combineLatest([
    this.productService.products$,
    this.route.queryParamMap.pipe(map((params) => params.get('priority'))),
  ]).pipe(
    map(([products, priority]) =>
      priority ? products.filter((product) => product.priority === priority) : products
    )
  );
  readonly soonToExpire$: Observable<Product[]> = this.productService.getSoonToExpire$();

  readonly productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['Verduras', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unit: ['unidades', Validators.required],
    expiry: ['', Validators.required],
    priority: ['Alta', Validators.required],
    notes: [''],
  });

  isSubmitting = false;

  ionViewDidEnter(): void {
    this.playScaleAnimation();
  }

  routeToAll(): void {
    this.router.navigate([], { queryParams: {} });
  }

  async addProduct(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    this.isSubmitting = true;

    this.productService
      .addProduct({
        ...value,
        priority: value.priority as 'Alta' | 'Media' | 'Baja',
        quantity: Number(value.quantity),
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: async () => {
          await this.presentToast('Producto añadido a la EcoLista ecológica.', 'success', 'leaf');
          await Haptics.impact({ style: ImpactStyle.Light });
          this.playScaleAnimation();
        },
        error: async () => {
          await this.presentToast(
            'No pudimos sincronizar el producto. Se guardó localmente y reintentaremos luego.',
            'warning',
            'alert'
          );
        },
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

  refreshProducts(event?: Event): void {
    this.productService
      .refreshFromApi()
      .pipe(finalize(() => (event as CustomEvent | undefined)?.detail?.complete?.()))
      .subscribe({
        error: async () =>
          this.presentToast(
            'No pudimos actualizar desde el servidor, mostrando productos guardados.',
            'warning',
            'cloud-offline'
          ),
      });
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

  private async presentToast(message: string, color: string, icon: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      icon,
    });
    await toast.present();
  }
}

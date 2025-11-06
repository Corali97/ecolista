import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AnimationController } from '@ionic/angular';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('welcomeCard', { read: ElementRef }) welcomeCard?: ElementRef<HTMLIonCardElement>;

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();

  constructor(
    private readonly productService: ProductService,
    private readonly animationCtrl: AnimationController,
    private readonly router: Router
  ) {}

  ionViewDidEnter(): void {
    if (!this.welcomeCard) {
      return;
    }

    this.animationCtrl
      .create()
      .addElement(this.welcomeCard.nativeElement)
      .duration(600)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(12px)', 'translateY(0)')
      .easing('ease-out')
      .play();
  }

  goToList(): void {
    this.router.navigateByUrl('/lista');
  }
}

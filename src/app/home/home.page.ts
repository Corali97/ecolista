import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AnimationController } from '@ionic/angular';

import { Product } from '../models/product';
import { EcoTipsService, TipsResponse } from '../services/eco-tips.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('welcomeCard', { read: ElementRef }) welcomeCard?: ElementRef<HTMLIonCardElement>;

  private readonly productService = inject(ProductService);
  private readonly animationCtrl = inject(AnimationController);
  private readonly router = inject(Router);
  private readonly ecoTipsService = inject(EcoTipsService);

  readonly summary$ = this.productService.getInventorySummary$();
  readonly nearExpiry$: Observable<Product[]> = this.productService.getSoonToExpire$();
<<<<<<< ours
  readonly tips$: Observable<TipsResponse> = this.ecoTipsService.tips$;
=======
  readonly offline$ = this.productService.offline$;
>>>>>>> theirs

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

  refreshTips(event: Event): void {
    this.ecoTipsService.refreshTips();
    setTimeout(() => (event as CustomEvent).detail?.complete?.(), 700);
  }
}

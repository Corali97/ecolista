import { Component, OnInit, inject } from '@angular/core';

import { EcoTip, EcoTipsService } from '../services/eco-tips.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
  standalone: false,
})
export class OfflinePage implements OnInit {
  private readonly ecoTipsService = inject(EcoTipsService);
  private readonly productService = inject(ProductService);

  cachedTips: EcoTip[] = [];
  readonly summary$ = this.productService.getInventorySummary$();

  ngOnInit(): void {
    this.loadCachedTips();
  }

  private async loadCachedTips(): Promise<void> {
    this.cachedTips = await this.ecoTipsService.getCachedTipsSnapshot();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OfflinePage } from './offline.page';

const routes: Routes = [
  {
    path: '',
    component: OfflinePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflinePageRoutingModule {}

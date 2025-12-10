import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'lista',
    canActivate: [authGuard],
    loadChildren: () => import('./lista/lista.module').then((m) => m.ListaPageModule),
  },
  {
    path: 'detalle/:id',
    canActivate: [authGuard],
    loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetallePageModule),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
  },
  {
    path: 'publicacion',
    canActivate: [authGuard],
    loadChildren: () => import('./publicacion/publicacion.module').then((m) => m.PublicacionPageModule),
  },
  {
    path: 'offline',
    loadChildren: () => import('./offline/offline.module').then((m) => m.OfflinePageModule),
  },
  {
    path: '**',
    redirectTo: 'offline',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

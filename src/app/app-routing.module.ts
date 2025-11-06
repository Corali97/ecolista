import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'lista',
    loadChildren: () => import('./lista/lista.module').then((m) => m.ListaPageModule),
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetallePageModule),
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

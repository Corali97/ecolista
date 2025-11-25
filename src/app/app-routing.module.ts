import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

<<<<<<< ours
import { AuthGuard } from './guards/auth.guard';
=======
import { authGuard } from './guards/auth.guard';
>>>>>>> theirs

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
<<<<<<< ours
    canActivate: [AuthGuard],
=======
    canActivate: [authGuard],
>>>>>>> theirs
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'lista',
<<<<<<< ours
    canActivate: [AuthGuard],
=======
    canActivate: [authGuard],
>>>>>>> theirs
    loadChildren: () => import('./lista/lista.module').then((m) => m.ListaPageModule),
  },
  {
    path: 'detalle/:id',
<<<<<<< ours
    canActivate: [AuthGuard],
=======
    canActivate: [authGuard],
>>>>>>> theirs
    loadChildren: () => import('./detalle/detalle.module').then((m) => m.DetallePageModule),
  },
  {
    path: 'perfil',
<<<<<<< ours
    canActivate: [AuthGuard],
=======
    canActivate: [authGuard],
>>>>>>> theirs
    loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
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

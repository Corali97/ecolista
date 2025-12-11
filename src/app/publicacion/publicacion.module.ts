<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { PublicacionPageRoutingModule } from './publicacion-routing.module';
import { PublicacionPage } from './publicacion.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PublicacionPageRoutingModule],
  declarations: [PublicacionPage],
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
import { NgModule } from '@angular/core';

import { PublicacionPage } from './publicacion.page';
import { PublicacionPageRoutingModule } from './publicacion-routing.module';

@NgModule({
  imports: [PublicacionPageRoutingModule, PublicacionPage],
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
})
export class PublicacionPageModule {}

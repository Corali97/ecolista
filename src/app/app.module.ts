import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
<<<<<<< ours
<<<<<<< ours
  imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule],
=======
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
>>>>>>> theirs
=======
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
>>>>>>> theirs
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PLATFORM_CONFIG_TOKEN, resolvePlatformConfig } from './config/platform-config';

const platformConfig = resolvePlatformConfig();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(platformConfig.ionicConfig),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: PLATFORM_CONFIG_TOKEN, useValue: platformConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

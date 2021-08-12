import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from '@app/app.component';
import { AvPlayerPage } from '@pages/av-player/av-player';
import { HomePage } from '@pages/home/home';
import { MediaDetailPage } from '@pages/media-detail/media-detail';
import { MediaProvider } from '@providers/media/media';
import { MediaDetailProvider } from '../providers/media-detail/media-detail';

@NgModule({
  declarations: [
    MyApp,
    AvPlayerPage,
    HomePage,
    MediaDetailPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AvPlayerPage,
    HomePage,
    MediaDetailPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MediaProvider,
    MediaDetailProvider,
  ]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { CreateTranslateLoader } from './create-translate-loader';
import { MyApp } from '@app/app.component';
import { LanguageProvider } from '@providers/language/language';
import { LanguagePopoverPage } from '@pages/language-popover/language-popover';

@NgModule({
  declarations: [
    MyApp,
    LanguagePopoverPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { pageTransition: 'ios-transition' }),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: CreateTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LanguagePopoverPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LanguageProvider,
  ]
})
export class AppModule {}

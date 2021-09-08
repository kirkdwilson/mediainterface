import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { CreateTranslateLoader } from './create-translate-loader';
import { MyApp } from '@app/app.component';
import { LanguagePopoverComponent } from '@components/language-popover/language-popover';
import { TocPopoverComponent } from '@components/toc-popover/toc-popover';
import { LanguageProvider } from '@providers/language/language';

@NgModule({
  declarations: [
    MyApp,
    LanguagePopoverComponent,
    TocPopoverComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
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
    LanguagePopoverComponent,
    TocPopoverComponent,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LanguageProvider,
  ]
})
export class AppModule {}

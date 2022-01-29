import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { AppFooterModule } from '@components/app-footer/app-footer.module';
import { MediaProvider } from '@providers/media/media';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
      AppFooterModule,
      IonicPageModule.forChild(HomePage),
      TranslateModule
    ],
    exports: [],
    declarations: [HomePage],
    providers: [MediaProvider],
})
export class HomeModule { }

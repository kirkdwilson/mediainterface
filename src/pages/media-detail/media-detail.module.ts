import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MediaDetailPage } from './media-detail';
import { IonicPageModule } from 'ionic-angular';
import { AppFooterModule } from '@components/app-footer/app-footer.module';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
      AppFooterModule,
      IonicPageModule.forChild(MediaDetailPage),
      TranslateModule,
    ],
    exports: [],
    declarations: [MediaDetailPage],
    providers: [
      DownloadFileProvider,
      MediaDetailProvider,
    ],
})
export class MediaDetailModule { }

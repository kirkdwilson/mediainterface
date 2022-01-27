import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MediaDetailPage } from './media-detail';
import { IonicPageModule } from 'ionic-angular';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { FileUtilityProvider } from '@providers/file-utility/file-utility';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
      IonicPageModule.forChild(MediaDetailPage),
      TranslateModule,
    ],
    exports: [],
    declarations: [MediaDetailPage],
    providers: [
      DownloadFileProvider,
      FileUtilityProvider,
      MediaDetailProvider,
    ],
})
export class MediaDetailModule { }

import { NgModule } from '@angular/core';
import { MediaDetailPage } from './media-detail';
import { IonicPageModule } from 'ionic-angular';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
        IonicPageModule.forChild(MediaDetailPage)
    ],
    exports: [],
    declarations: [MediaDetailPage],
    providers: [MediaDetailProvider],
})
export class MediaDetailModule { }

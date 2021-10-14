import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvPlayerPage } from './av-player';
import { IonicPageModule } from 'ionic-angular';
import { AvPlayerDataStoreProvider } from '@providers/av-player-data-store/av-player-data-store';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
        IonicPageModule.forChild(AvPlayerPage),
        TranslateModule
    ],
    exports: [],
    declarations: [AvPlayerPage],
    providers: [AvPlayerDataStoreProvider],
})
export class AvPlayerModule { }

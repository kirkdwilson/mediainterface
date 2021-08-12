import { NgModule } from '@angular/core';
import { AvPlayerPage } from './av-player';
import { IonicPageModule } from 'ionic-angular';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
        IonicPageModule.forChild(AvPlayerPage)
    ],
    exports: [],
    declarations: [AvPlayerPage],
    providers: [],
})
export class AvPlayerModule { }

import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { MediaProvider } from '@providers/media/media';

/**
 * Let's lazy load the pages.
 *
 * @link https://developer.school/ionic-3-lazy-loading-components/
 */
@NgModule({
    imports: [
        IonicPageModule.forChild(HomePage)
    ],
    exports: [],
    declarations: [HomePage],
    providers: [MediaProvider],
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaseViewerPageModule } from '@pages/base-viewer/base-viewer.module';
import { EpubViewerPage } from './epub-viewer';

@NgModule({
  declarations: [
    EpubViewerPage,
  ],
  exports: [BaseViewerPageModule],
  imports: [
    BaseViewerPageModule,
    IonicPageModule.forChild(EpubViewerPage),
  ],
  providers: []
})
export class EpubViewerPageModule {}

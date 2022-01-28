import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaseViewerPageModule } from '@pages/base-viewer/base-viewer.module';
import { H5pViewerPage } from './h5p-viewer';

@NgModule({
  declarations: [
    H5pViewerPage,
  ],
  exports: [BaseViewerPageModule],
  imports: [
    BaseViewerPageModule,
    IonicPageModule.forChild(H5pViewerPage),
  ],
})
export class H5pViewerPageModule {}

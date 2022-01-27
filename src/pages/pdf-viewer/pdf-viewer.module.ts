import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdfViewerPage } from './pdf-viewer';
import { BaseViewerPageModule } from '@pages/base-viewer/base-viewer.module';

@NgModule({
  declarations: [
    PdfViewerPage,
  ],
  exports: [BaseViewerPageModule],
  imports: [
    BaseViewerPageModule,
    IonicPageModule.forChild(PdfViewerPage),
  ],
  providers: []
})
export class PdfViewerPageModule {}

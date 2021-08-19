import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdfViewerPage } from './pdf-viewer';

@NgModule({
  declarations: [
    PdfViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(PdfViewerPage),
  ],
})
export class PdfViewerPageModule {}

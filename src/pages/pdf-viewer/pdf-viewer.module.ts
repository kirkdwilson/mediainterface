import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdfViewerPage } from './pdf-viewer';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';

@NgModule({
  declarations: [
    PdfViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(PdfViewerPage),
  ],
  providers: [NavParamsDataStoreProvider]
})
export class PdfViewerPageModule {}

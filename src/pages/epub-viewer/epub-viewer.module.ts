import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpubViewerPage } from './epub-viewer';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';
import { DownloadFileProvider } from '@providers/download-file/download-file';

@NgModule({
  declarations: [
    EpubViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(EpubViewerPage),
  ],
  providers: [
    DownloadFileProvider,
    NavParamsDataStoreProvider,
  ]
})
export class EpubViewerPageModule {}

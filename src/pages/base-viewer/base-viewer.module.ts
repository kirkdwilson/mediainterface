import { NgModule } from '@angular/core';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';
import { DownloadFileProvider } from '@providers/download-file/download-file';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    DownloadFileProvider,
    NavParamsDataStoreProvider,
  ]
})
export class BaseViewerPageModule {}

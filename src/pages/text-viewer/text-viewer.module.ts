import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaseViewerPageModule } from '@pages/base-viewer/base-viewer.module';
import { FileUtilityProvider } from '@providers/file-utility/file-utility';
import { TextViewerPage } from './text-viewer';

@NgModule({
  declarations: [
    TextViewerPage,
  ],
  exports: [BaseViewerPageModule],
  imports: [
    BaseViewerPageModule,
    IonicPageModule.forChild(TextViewerPage),
  ],
  providers: [
    FileUtilityProvider,
  ],
})
export class TextViewerPageModule {}

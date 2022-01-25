import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaseViewerPageModule } from '@pages/base-viewer/base-viewer.module';
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
  providers: [],
})
export class TextViewerPageModule {}

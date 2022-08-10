import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DownloadButtonComponent } from './download-button';
import { DownloadFileProvider } from '@providers/download-file/download-file';
/**
 * The module for app footer
 */
@NgModule({
	declarations: [DownloadButtonComponent],
	imports: [IonicModule],
	exports: [DownloadButtonComponent],
  providers: [DownloadFileProvider],
})
export class DownloadButtonModule {}

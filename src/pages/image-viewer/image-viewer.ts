import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BaseViewerPage } from '@pages/base-viewer/base-viewer';
import { BaseViewerPageInterface } from '@interfaces/base-viewer.interface';

/**
 * A viewer for displaying images
 */
@IonicPage({
  name: 'image-viewer',
  segment: 'details/:slug/image-viewer',
})
@Component({
  selector: 'page-image-viewer',
  templateUrl: 'image-viewer.html',
})
export class ImageViewerPage extends BaseViewerPage implements BaseViewerPageInterface {

  /**
   * Load the requested file
   *
   * @return void
   */
  loadFile() {}

}

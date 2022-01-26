import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BaseViewerPage } from '@pages/base-viewer/base-viewer';
import { BaseViewerPageInterface } from '@interfaces/base-viewer.interface';
import { ViewerItem } from '@interfaces/viewer-item.interface';

/**
 * A viewer for h5p documents
 */
@IonicPage({
  name: 'h5p-viewer',
  segment: 'details/:slug/h5p-viewer',
})
@Component({
  selector: 'page-h5p-viewer',
  templateUrl: 'h5p-viewer.html',
})
export class H5pViewerPage extends BaseViewerPage implements BaseViewerPageInterface {
  /**
   * The currently selected item
   */
  item: ViewerItem = null;

  /**
   * Load the requested file
   *
   * @return void
   */
  loadFile() {
    this.item = this.firstItem;
    console.log(this.item);
  }
}

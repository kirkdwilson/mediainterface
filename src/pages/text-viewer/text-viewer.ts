import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BaseViewerPage } from '@pages/base-viewer/base-viewer';
import { BaseViewerPageInterface } from '@interfaces/base-viewer.interface';

/**
 * A viewer for text files.
 */
@IonicPage({
  name: 'text-viewer',
  segment: 'details/:slug/text-viewer',
})
@Component({
  selector: 'page-text-viewer',
  templateUrl: 'text-viewer.html',
})
export class TextViewerPage extends BaseViewerPage implements BaseViewerPageInterface {

  /**
   * load the requested file
   *
   * @return void
   */
  loadFile() {
    console.log('here!');
  }

}

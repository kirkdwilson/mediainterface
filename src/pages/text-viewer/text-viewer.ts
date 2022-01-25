import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { FileUtilityProvider } from '@providers/file-utility/file-utility';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';
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
   * The content of the text file
   */
  content = 'Loading..';

  constructor(
    protected dataStore: NavParamsDataStoreProvider,
    protected downloadFileProvider: DownloadFileProvider,
    protected fileUtilityProvider: FileUtilityProvider,
    protected navController: NavController,
    protected navParams: NavParams,
    protected viewController: ViewController,
  ) {
    super(
      dataStore,
      downloadFileProvider,
      navController,
      navParams,
      viewController
    );
  }

  /**
   * load the requested file
   *
   * @return void
   */
  loadFile() {
    this.fileUtilityProvider.read(this.item.path).pipe(take(1)).subscribe((content: string) =>  this.content = content.replace(/(?:\r\n|\r|\n)/g, '<br>'));
  }

}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';
import { ViewerItem } from '@interfaces/viewer-item.interface';

/**
 * A base viewer for the viewers to inherit from.  Stores common code.
 * Children of this class MUST implement BaseViewerPageInterface.
 */
@Component({
  template: ''
})
export class BaseViewerPage {

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLinkRef: ElementRef;

  /**
   * The first item to display.
   */
  protected firstItem: ViewerItem = null;

  /**
   * The items being viewed
   */
  protected items: Array<ViewerItem> = null;

  /**
   * The slug for the previous page
   */
  protected slug = '';

  /**
   * The key to use for our storage
   */
  protected storageKey = 'viewer-item';

  constructor(
    protected dataStore: NavParamsDataStoreProvider,
    protected downloadFileProvider: DownloadFileProvider,
    protected navController: NavController,
    protected navParams: NavParams,
    protected viewController: ViewController,
  ) {
  }

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewDidLoad() {
    this.slug = this.navParams.get('slug');
    this.items = this.navParams.get('items');
    if (typeof this.items === 'undefined') {
        // They refreshed the page. Get the data from the store.
        this.dataStore.get(this.storageKey).pipe(take(1)).subscribe((data: string) => {
          if (data === '') {
            this.goBack();
          }
          this.items = JSON.parse(data);
          this.firstItem = this.items.find((item: ViewerItem) =>  item.isFirst);
          // @ts-ignore It needs to be implemented by child class
          this.loadFile();
        });
    } else {
      this.firstItem = this.items.find((item: ViewerItem) =>  item.isFirst);
      this.dataStore.store(this.storageKey, JSON.stringify(this.items)).pipe(take(1)).subscribe(() => {
        // @ts-ignore It needs to be implemented by child class
        this.loadFile();
      });
    }
  }

  /**
   * Download the file.  To use this method, you need to add this to your template:
   *
   * ```
   * <a #downloadLink class="hidden"></a>
   * ```
   *
   * @return void
   * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
   */
  downloadFile(filePath: string) {
    const fileName = filePath.split('\\').pop().split('/').pop();
    this.downloadFileProvider.download(filePath).pipe(take(1)).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const link = this.downloadLinkRef.nativeElement;
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /**
   * Go back to the previous page
   *
   * @return void
   */
  goBack() {
    this.dataStore.remove(this.storageKey);
    if (this.navController.canGoBack()) {
      this.navController.pop();
    } else if (this.slug !== '') {
      this.navController.push(
        'media-details',
        { slug: this.slug },
        {
          animate: true,
          direction: 'back',
        },
      ).then(() => {
        // Remove us from backstack
        this.navController.remove(this.viewController.index);
        this.navController.insert(0, 'HomePage');
      });
    } else {
      this.navController.goToRoot({
        animate: true,
      });
    }
  }

}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Book, Rendition } from 'epubjs';
import { take } from 'rxjs/operators/take';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { EpubViewerItem } from './epub-viewer-item.interface';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';

/**
 * ePubjs is included in index.html
 */
// declare var ePub: any;

/**
 * An epub viewer.
 */
@IonicPage({
  name: 'epub-viewer',
  segment: 'details/:slug/epub-viewer',
})
@Component({
  selector: 'page-epub-viewer',
  templateUrl: 'epub-viewer.html',
})
export class EpubViewerPage {

  /**
   * The book we are viewing
   */
  book: any = null;

  /**
   * The rendition of the book
   */
  rendition: any = null;

  /**
   * The current page we are viewing
   */
  currentPage: number = 1;

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLinkRef: ElementRef;

  /**
   * The item to view
   */
  private item: EpubViewerItem = null;

  /**
   * The slug for the previous page
   */
  slug = '';

  /**
   * Our storage key
   */
  private storageKey = 'epub-viewer';

  constructor(
    private dataStore: NavParamsDataStoreProvider,
    private downloadFileProvider: DownloadFileProvider,
    private navController: NavController,
    private navParams: NavParams,
    private viewController: ViewController,
  ) {
  }

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewDidLoad() {
    this.item = this.navParams.get('item');
    this.slug = this.navParams.get('slug');
    if (typeof this.item === 'undefined') {
        // They refreshed the page. Get the data from the store.
        this.dataStore.get(this.storageKey).pipe(take(1)).subscribe((data: string) => {
          if (data === '') {
            this.goBack();
          }
          this.item = JSON.parse(data);
          this.loadFile();
        });
    } else {
      this.dataStore.store(this.storageKey, JSON.stringify(this.item)).pipe(take(1)).subscribe(() => this.loadFile());
    }
  }

  /**
   * Download the file.
   *
   * @return void
   * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
   */
  downloadFile() {
    const fileName = this.item.url.split('\\').pop().split('/').pop();
    this.downloadFileProvider.download(this.item.url).pipe(take(1)).subscribe((blob: any) => {
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

  /**
   * Load the file
   *
   * @return void
   */
  loadFile() {
    this.book = new Book(this.item.url);
    this.rendition = this.book.renderTo('book', { width: '100%', height: '100%' });
    this.rendition.display();
    this.rendition.on('relocated', (location) => {
      console.log(location);
    });
  }

  /**
   * Go to the previous page.
   *
   * @return void
   */
  prev() {
    if (this.currentPage === 1) {
        return;
    }
    this.currentPage -= 1;
    this.rendition.prev();
  }

  /**
   * Go to the next page.
   *
   * @return void
   */
  next() {
    this.currentPage += 1;
    this.rendition.next();
  }

}

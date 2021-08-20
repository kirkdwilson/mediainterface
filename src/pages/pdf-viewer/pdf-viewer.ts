import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import * as PDFJS from 'pdfjs-dist/webpack.js';
import { PdfViewerItem } from './pdf-viewer-item.interface';
import { PDFPageProxy, PDFPageViewport, PDFRenderTask } from 'pdfjs-dist';
import { PageState } from './page-state.interface';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { NavParamsDataStoreProvider } from '@providers/nav-params-data-store/nav-params-data-store';

/**
 * A PDF viewer
 * @link https://www.saninnsalas.com/using-pdf-js-with-ionic-3-x/
 */
@IonicPage({
  name: 'pdf-viewer',
  segment: 'details/:slug/pdf-viewer',
})
@Component({
  selector: 'page-pdf-viewer',
  templateUrl: 'pdf-viewer.html',
})
export class PdfViewerPage {

  /**
   * The canvas size
   */
  canvasSize: any = {
    height: 0,
    width: 0,
  };

  /**
   * Keep track of the paging
   */
  pageState: PageState = {
    alteredScale: false,
    current: 1,
    scale: 1,
    scaleRate: .25,
    total: 1,
  };

  /**
   * The proxy to the PDFDocument in the worker tread.
   */
  pdfDocument: PDFJS.PDFDocumentProxy;

  /**
   * The PDFJS instance
   */
  PDFJSViewer = PDFJS;

  /**
   * The canvas where the PDF is drawn
   */
  @ViewChild('canvas') canvasRef: ElementRef;

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLinkRef: ElementRef;

  /**
   * The text container for storing the text layer that enables copy and paste
   */
  @ViewChild('textContainer') textContainerRef: ElementRef;

  /**
   * The viewer
   */
  @ViewChild('viewer') viewerRef: ElementRef;

  /**
   * The PDF item
   */
  item: PdfViewerItem = null;

  /**
   * The slug for the previous page
   */
  slug = '';

  /**
   * Our storage key
   */
  private storageKey = 'pdf-viewer';

  constructor(
    private dataStore: NavParamsDataStoreProvider,
    private downloadFileProvider: DownloadFileProvider,
    private navController: NavController,
    private navParams: NavParams,
    private viewController: ViewController,
    private zone: NgZone,
  ) {}

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewDidLoad() {
    this.item = this.navParams.get('item');
    this.slug = this.navParams.get('slug');
    if (typeof this.item === 'undefined') {
      this.dataStore.get(this.storageKey).pipe(take(1)).subscribe((data: string) => {
        if (data === '') {
          this.goBack();
        }
        this.item = JSON.parse(data);
        this.loadPdf();
      });
    } else {
      this.dataStore.store(this.storageKey, JSON.stringify(this.item)).pipe(take(1)).subscribe(() => this.loadPdf());
    }
  }

  /**
   * Can we still decrease the scale?
   *
   * @return yes|no
   */
  canDecreaseScale(): boolean {
    return ((this.pageState.scale - this.pageState.scaleRate) > 0);
  }

  /**
   * Decrease the current scale.
   *
   * @return void
   */
  decreaseScale() {
    if (!this.canDecreaseScale()) {
        return;
    }
    this.pageState.scale = this.pageState.scale - this.pageState.scaleRate;
    this.pageState.alteredScale = true;
    this.loadPage(this.pageState.current);
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
   * Increase the current scale.
   *
   * @return void
   */
  increaseScale() {
    this.pageState.scale = this.pageState.scale + this.pageState.scaleRate;
    this.pageState.alteredScale = true;

    this.loadPage(this.pageState.current);
  }

  /**
   * Are we on the first page?
   *
   * @return yes|no
   */
  isFirstPage(): boolean {
    return (this.pageState.current === 1);
  }

  /**
   * Are we on the last page?
   *
   * @return yes|no
   */
  isLastPage(): boolean {
    return (this.pageState.current >= this.pageState.total);
  }

  /**
   * Load the next page
   *
   * @return void
   */
  loadNextPage() {
    if (this.isLastPage()) {
      return;
    }
    const page = this.pageState.current + 1;
    this.loadPage(page);
  }

  /**
   * Load the previous page.
   *
   * @return void
   */
  loadPreviousPage() {
    if (this.isFirstPage()) {
      return;
    }
    const page = this.pageState.current - 1;
    this.loadPage(page);
  }

  /**
   * Load the PDF.
   *
   * @return The promise and whethe it loaded
   */
  loadPdf(): Promise<boolean> {
    return this.PDFJSViewer.getDocument(this.item.url)
      .promise.then(pdf => {
        this.pdfDocument = pdf;
        this.zone.run(() => this.pageState.total = pdf.numPages);
        return this.loadPage(1);
      }).catch(e => {
        console.error(e);
        return false;
      });
  }

  /**
   * Load the given page.
   *
   * @param  pageNum The page number
   * @return         void
   */
  loadPage(pageNum: number = 1) {
    let pdfPage: PDFPageProxy;

    return this.pdfDocument.getPage(pageNum).then(thisPage => {
      pdfPage = thisPage;
      return this.renderOnePage(pdfPage);
    }).then(() => {
      this.zone.run(() => this.pageState.current = pageNum);
      return pdfPage;
    });
  }

  /**
   * Render a single page
   *
   * @param  pdfPage Page to render
   * @return         void
   */
  private async renderOnePage(pdfPage: PDFPageProxy) {
    let canvasContext: CanvasRenderingContext2D;
    const textContainer = this.textContainerRef.nativeElement as HTMLElement;
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const viewer = this.viewerRef.nativeElement as HTMLElement;

    canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvasContext.imageSmoothingEnabled = false;
    canvasContext.webkitImageSmoothingEnabled = false;
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.oImageSmoothingEnabled = false;

    let scale = this.pageState.scale;

    if (!this.pageState.alteredScale) {
      const unscaledViewport = pdfPage.getViewport({ scale: this.pageState.scale }) as PDFPageViewport;
      scale = viewer.offsetWidth / unscaledViewport.width;
      this.pageState.scale = scale;
    }

    const viewport = pdfPage.getViewport({ scale: scale }) as PDFPageViewport;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    this.canvasSize.width = viewport.width;
    this.canvasSize.height = viewport.height;

    //fix for 4K
    if (window.devicePixelRatio > 1) {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;

      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";

      canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // THIS RENDERS THE PAGE !!!!!!
    let renderTask: PDFRenderTask = pdfPage.render({
        canvasContext,
        viewport,
    });
    let container = textContainer;
    return renderTask.promise.then(() => pdfPage.getTextContent()).then((textContent) => {
      let textLayer: HTMLElement;
      textLayer = textContainer;
      while (textLayer.lastChild) {
          textLayer.removeChild(textLayer.lastChild);
      }
      this.PDFJSViewer.renderTextLayer({
          textContent,
          container,
          viewport,
          textDivs: []
      });
      return true;
    });
  }

}

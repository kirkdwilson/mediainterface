import { Component, ElementRef, NgZone, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import * as PDFJS from 'pdfjs-dist/webpack.js';
import { PdfViewerItem } from './pdf-viewer-item.interface';
import { PDFPageProxy, PDFPageViewport, PDFRenderTask } from 'pdfjs-dist';
import { PagePosition } from './page-position.interface';
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
    lastLoaded: 1,
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
   * The content view child.
   */
  @ViewChild(Content) content: Content;

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLinkRef: ElementRef;

  /**
   * The template for each page of the PDF
   */
  @ViewChild('pageCanvasTemplate') pageCanvasTemplate: TemplateRef<any>;

  /**
   * The view container that holds the pages
   */
  @ViewChild('pagesContainer', { read: ViewContainerRef }) pagesContainer: ViewContainerRef;

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
   * Are we scrolling to the next or previous view?
   */
  private isAutoScrolling = false;

  /**
   * Holds information about each page's position on the view.
   */
  private pagePositions: Array<PagePosition> = [];

  /**
   * Our subscription to scroll events
   */
  private scrollStream$: any = null;

  /**
   * Our storage key
   */
  private storageKey = 'pdf-viewer';

  constructor(
    private dataStore: NavParamsDataStoreProvider,
    private downloadFileProvider: DownloadFileProvider,
    private navController: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private renderer: Renderer2,
    private viewController: ViewController,
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
   * Ionic LifeCycle the view will enter
   *
   * @return void
   */
  ionViewWillEnter() {
    /**
     * We need to keep track of which page the user is viewing
     */
    this.scrollStream$ = this.content.ionScroll.subscribe((event: any) => {
      if (!event) {
        return;
      }
      const current = this.pagePositions.find((page: PagePosition) => (event.scrollTop >= page.top) && (event.scrollTop <= page.bottom));
      if (!current) {
        return;
      }
      this.zone.run(() => this.pageState.current = current.pageNumber);
    });
  }

  /**
   * Ionic LifeCycle the view will leave
   *
   * @return void
   */
  ionViewWillLeave() {
    if (this.scrollStream$) {
      this.scrollStream$.unsubscribe();
      this.scrollStream$ = null;
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
   * What do we do when the user scrolls?
   *
   * @param  infiniteScroll The infinite scroll event
   * @return                void
   */
  doInfinite(infiniteScroll) {
    if (this.pageState.lastLoaded === this.pageState.total) {
      infiniteScroll.complete();
      return;
    }
    const next = this.pageState.lastLoaded + 1;
    this.loadPage(next).then(() => infiniteScroll.complete());
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
  goToNextPage() {
    if ((this.isLastPage()) || (this.isAutoScrolling)) {
      // prevent hitting the button twice
      return;
    }
    const page = this.pageState.current + 1;
    const existing: PagePosition = this.pagePositions.find((data: PagePosition) => data.pageNumber === page);
    if (existing) {
      this.isAutoScrolling = true;
      this.content.scrollTo(0, existing.top + 10, 3000)
        .then(() => this.isAutoScrolling = false)
        .catch(() => this.isAutoScrolling = false);
    } else {
      this.loadPage(page).then(() => {
        const data: PagePosition = this.pagePositions.find((data: PagePosition) => data.pageNumber === page);
        this.isAutoScrolling = true;
        this.content.scrollTo(0, data.top + 10, 3000)
          .then(() => this.isAutoScrolling = false)
          .catch(() => this.isAutoScrolling = false);
      });
    }
  }

  /**
   * Load the previous page.
   *
   * @return void
   */
  goToPreviousPage() {
    if ((this.isFirstPage()) || (this.isAutoScrolling)) {
      // prevent hitting the button twice
      return;
    }
    const page = this.pageState.current - 1;
    const existing: PagePosition = this.pagePositions.find((data: PagePosition) => data.pageNumber === page);
    // Page should already exist!
    this.isAutoScrolling = true;
    this.content.scrollTo(0, existing.top, 3000)
      .then(() => this.isAutoScrolling = false)
      .catch(() => this.isAutoScrolling = false);
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
    const pageView: ViewRef = this.pageCanvasTemplate.createEmbeddedView({ pageNum: pageNum });
    pageView.detectChanges();
    this.pagesContainer.insert(pageView);
    return this.pdfDocument.getPage(pageNum).then(thisPage => {
      pdfPage = thisPage;
      return this.renderPage(pdfPage, pageNum);
    }).then(() => {
      this.pageState.lastLoaded = pageNum;
      const pageEle = document.getElementById(`page-${pageNum}`);
      const top = pageEle.offsetTop;
      const bottom = (pageEle.offsetTop + pageEle.offsetHeight);
      const position: PagePosition = {
        bottom: bottom,
        pageNumber: pageNum,
        top: top,
      };
      this.pagePositions.push(position);
      return pdfPage;
    });
  }

  /**
   * Render a single page
   *
   * @param   pdfPage Page to render
   * @param   pageNum The page number
   * @return         void
   */
  private async renderPage(pdfPage: PDFPageProxy, pageNum: number) {
    let canvasContext: CanvasRenderingContext2D;
    const viewer = this.viewerRef.nativeElement as HTMLElement;
    const canvas = viewer.querySelector(`#page-${pageNum} .page-canvas`) as HTMLCanvasElement;
    const textContainer = viewer.querySelector(`#page-${pageNum} .text-container`) as HTMLElement;

    canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvasContext.imageSmoothingEnabled = false;
    canvasContext.webkitImageSmoothingEnabled = false;
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.oImageSmoothingEnabled = false;

    let scale = this.pageState.scale;

    if ((pageNum === 1) && (!this.pageState.alteredScale)) {
      /**
       * We need to only dynamically change scale to device screen size the first time.  Once content
       * is added the unscaledViewport.width becomes larger and warps the scale.
       */
      const unscaledViewport = pdfPage.getViewport({ scale: this.pageState.scale }) as PDFPageViewport;
      scale = viewer.offsetWidth / unscaledViewport.width;
      this.pageState.scale = scale;
    }

    const viewport = pdfPage.getViewport({ scale: scale }) as PDFPageViewport;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    this.zone.run(() => {
      this.canvasSize.width = viewport.width;
      this.canvasSize.height = viewport.height;
    });

    //fix for 4K
    if (window.devicePixelRatio > 1) {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;

      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";

      this.zone.run(() => {
        this.canvasSize.width = canvasWidth;
        this.canvasSize.height = canvasHeight;
      });

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

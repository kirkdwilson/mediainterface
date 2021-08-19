import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import * as PDFJS from 'pdfjs-dist/webpack.js';
import { PdfViewerItem } from './pdf-viewer-item.interface';
import { PDFPageProxy, PDFPageViewport, PDFRenderTask } from 'pdfjs-dist';
import { PageState } from './page-state.interface';
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
   * Keep track of the paging
   */
  pageState: PageState = {
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
   * Stores elements used by the PDF viewer
   */
  pageContainerUnique = {
      width: 0 as number,
      height: 0 as number,
      element: null as HTMLElement,
      canvas: null as HTMLCanvasElement,
      textContainer: null as HTMLElement,
      canvasWrapper: null as HTMLElement,
  };

  /**
   * The PDF page container
   */
  @ViewChild('pageContainer') pageContainerRef: ElementRef;

  /**
   * The viewer
   */
  @ViewChild('viewer') viewerRef: ElementRef;

  /**
   * The canvas where the PDF is drawn
   */
  @ViewChild('canvas') canvasRef: ElementRef;

  /**
   * The wrapper around the canvas
   */
  @ViewChild('canvasWrapper') canvasWrapperRef: ElementRef;

  /**
   * The text container for storing the text layer that enables copy and paste
   */
  @ViewChild('textContainer') textContainerRef: ElementRef;

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
    private navController: NavController,
    private navParams: NavParams,
    private dataStore: NavParamsDataStoreProvider,
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
    this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
    this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
    this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.pageContainerUnique.textContainer = this.textContainerRef.nativeElement as HTMLCanvasElement;
    if (typeof this.item === 'undefined') {
      this.dataStore.get(this.storageKey).pipe(take(1)).subscribe((data: string) => {
        if (data === '') {
          this.goBack();
        }
        this.item = JSON.parse(data);
        this.loadPdf();
      });
    } else {
      this.dataStore.store(this.storageKey, JSON.stringify(this.item)).pipe(take(1)).subscribe(() => this.loadPdf())
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
    this.zone.run(() => this.pageState.scale = this.pageState.scale - this.pageState.scaleRate);
    this.loadPage(this.pageState.current);
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
    this.zone.run(() => this.pageState.scale = this.pageState.scale + this.pageState.scaleRate);

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
    let textContainer: HTMLElement;
    let canvas: HTMLCanvasElement;
    let wrapper: HTMLElement;
    let canvasContext: CanvasRenderingContext2D;
    let page: HTMLElement

    page = this.pageContainerUnique.element;
    textContainer = this.pageContainerUnique.textContainer;
    canvas = this.pageContainerUnique.canvas;
    wrapper = this.pageContainerUnique.canvasWrapper;

    canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvasContext.imageSmoothingEnabled = false;
    canvasContext.webkitImageSmoothingEnabled = false;
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.oImageSmoothingEnabled = false;

    let viewport = pdfPage.getViewport({ scale: this.pageState.scale }) as PDFPageViewport;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    page.style.width = `${viewport.width}px`;
    page.style.height = `${viewport.height}px`;
    wrapper.style.width = `${viewport.width}px`;
    wrapper.style.height = `${viewport.height}px`;
    textContainer.style.width = `${viewport.width}px`;
    textContainer.style.height = `${viewport.height}px`;

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
        viewport
    });
    let container = textContainer;
    return renderTask.promise.then(() => pdfPage.getTextContent()).then((textContent) => {
      let textLayer: HTMLElement;
      textLayer = this.pageContainerUnique.textContainer;
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

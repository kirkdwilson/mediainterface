import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { merge } from 'rxjs/observable/merge';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { take } from 'rxjs/operators/take';
import { Language } from '@models/language';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { LanguageProvider } from '@providers/language/language';
import { StatReporterProvider } from '@providers/stat-reporter/stat-reporter';

/**
 * Download media.  Will display a loader while preparing the download.  Once completed,
 * it reports the download for stat tracking.
 *
 * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
 */
@Component({
  selector: 'download-button',
  templateUrl: 'download-button.html'
})
export class DownloadButtonComponent {

  /**
   * The path of the file to download
   */
  @Input() filePath = '';

  /**
   * Fired once the file is downloaded.
   */
  @Output() onDownloaded = new EventEmitter<void>();

  /**
   * The media provider for the resource
   */
  @Input() mediaProvider = '';

  /**
   * The type of media for the resource
   */
  @Input() mediaType = '';

  /**
   * The slug for the resource
   */
  @Input() slug = '';

  /**
   * Is the file in the process of downloading?
   */
  isDownloading = false;

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLink: ElementRef;

  constructor(
    private downloadFileProvider: DownloadFileProvider,
    private languageProvider: LanguageProvider,
    private statReporterProvider: StatReporterProvider,
  ) {
  }

  /**
   * Download the file
   *
   * @return void
   */
  downloadFile() {
    this.isDownloading = true;
    merge(
      this.download().pipe(take(1)),
      this.reportDownload().pipe(take(1)),
    ).subscribe(() => this.isDownloading = false);
  }

  /**
   * Download the file
   *
   * @return The blob of the file
   */
  private download(): Observable<void> {
    const fileName = this.filePath.split('\\').pop().split('/').pop();
    return this.downloadFileProvider
      .download(this.filePath).pipe(map((blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const link = this.downloadLink.nativeElement;
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        this.onDownloaded.emit();
      }));
  }

  /**
   * Report the download
   *
   * @return boolean Did it report successfully?
   */
  private reportDownload(): Observable<boolean> {
    if ((this.mediaProvider === '') && (this.mediaType === '') && (this.slug === '')) {
        return of(false);
    }
    return this.languageProvider.getLanguage()
      .pipe(
        mergeMap((lang: Language) => this.statReporterProvider.report(this.slug, 'download', lang.twoLetterCode, this.mediaProvider, this.mediaType))
      );
  }

}

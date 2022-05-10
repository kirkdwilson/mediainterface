import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { merge } from 'rxjs/observable/merge';
import { take } from 'rxjs/operators/take';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { LanguageProvider } from '@providers/language/language';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';
import { StatReporterProvider } from '@providers/stat-reporter/stat-reporter';
import { Episode } from '@models/episode';
import { Language } from '@models/language';
import { Media } from '@models/media';
import { AvPlayerItem } from '@interfaces/av-player-item.interface';
import { LanguagePopoverComponent } from '@components/language-popover/language-popover';
import { ViewerItem } from '@interfaces/viewer-item.interface';

/**
 * The detail page for a specific piece of media.
 */
@IonicPage({
  defaultHistory: ['HomePage'],
  name: 'media-details',
  segment: 'details/:slug',
})
@Component({
  selector: 'page-media-detail',
  templateUrl: 'media-detail.html',
})
export class MediaDetailPage {

  /**
   * A reference to the download link
   */
  @ViewChild('downloadLink') downloadLink: ElementRef;

  /**
   * The current media
   */
  media: Media = null;

  /**
   * The current slug
   */
  slug = '';

  /**
   * A list of available viewers. (av-player does not get added)
   */
  private availableViewers = ['epub-viewer', 'h5p-viewer', 'image-viewer', 'pdf-viewer', 'text-viewer'];

  /**
   * Which media players currently have a viewer
   */
  private mediaTypesWithViewers = ['pdf', 'epub', 'video', 'audio', 'text', 'image', 'h5p', 'html'];

  /**
   * The current language
   */
  private currentLanguage: Language = null;

  /**
   * Our stream for tracking changes on the language
   */
  private languageOnChangeStream$: any = null;

  constructor(
    private downloadFileProvider: DownloadFileProvider,
    private languageProvider: LanguageProvider,
    private mediaDetailProvider: MediaDetailProvider,
    private navController: NavController,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private statReporterProvider: StatReporterProvider,
  ) {}

  /**
   * Life cycle for Ionic
   *
   * @return void
   */
  ionViewWillEnter() {
    this.slug = this.navParams.get('slug');
    this.languageProvider.getLanguage().pipe(take(1)).subscribe((lang: Language) => this.loadData(lang));
    this.languageOnChangeStream$ = this.languageProvider.onLanguageChange.subscribe((lang: Language) => this.loadData(lang));
  }

  /**
   * Ionic LifeCycle the view will leave
   *
   * @return void
   */
  ionViewWillLeave() {
    if (this.languageOnChangeStream$) {
      this.languageOnChangeStream$.unsubscribe();
      this.languageOnChangeStream$ = null;
    }
  }

  /**
   * Download a file
   *
   * @param  fileToDownload   The path to the file to download
   *
   * @return         void
   * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
   */
  downloadFile(
    fileToDownload: string,
    mediaType: string,
    slug: string,
  ) {
    const fileName = fileToDownload.split('\\').pop().split('/').pop();
    merge(
      this.downloadFileProvider.download(fileToDownload).pipe(
        map((blob: any)  =>  {
          const url = window.URL.createObjectURL(blob);
          const link = this.downloadLink.nativeElement;
          link.href = url;
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        }),
        take(1),
      ),
      this.statReporterProvider.report(slug, 'download', this.currentLanguage.twoLetterCode, mediaType).pipe(
        take(1)
      ),
    ).subscribe();
  }

  /**
   * Is this a book?
   *
   * @param  mediaType The type of media
   * @return           yes|no
   */
  isBook(mediaType: string): boolean {
    return (['pdf', 'epub'].indexOf(mediaType) !== -1);
  }

  /**
   * Has a player?
   *
   * @param  mediaType The type of media
   * @return           yes|no
   */
  hasViewer(mediaType: string, isEpisode: boolean = false): boolean {
    return (this.mediaTypesWithViewers.indexOf(mediaType) !== -1);
  }


  /**
   * Get the play icon based on the media type
   * @param  mediaType The type of media
   * @return           The icon name
   */
  playIcon(mediaType: string): string {
    if (this.isBook(mediaType)) {
      return 'book';
    }
    if (mediaType === 'html') {
      return 'exit';
    }
    if (mediaType === 'text') {
      return 'document';
    }
    return 'play';
  }

  /**
   * Play the provided episode
   *
   * @param  episode The episode to play
   * @return         void
   */
  playEpisode(current: Episode) {
    const viewer = this.getViewer(current.mediaType);
    if ((current.mediaType === 'video') || (current.mediaType === 'audio')) {
      const items = this.media.episodes.map((episode: Episode) => {
        const playFirst = (episode.title === current.title);
        return {
          url: episode.filePath,
          playFirst: playFirst,
          posterUrl: episode.imagePath,
          type: episode.mediaType,
        };
      });
      this.navController.push('av-player', { items: items, slug: this.slug });
    }  else if (current.mediaType === 'html') {
      window.open(current.filePath);
    } else if (viewer !== '') {
      const items: Array<ViewerItem> = this.media.episodes.map((episode: Episode) => {
        const playFirst = (episode.title === current.title);
        return {
          downloadPath: episode.downloadPath,
          filePath: episode.filePath,
          isFirst: playFirst,
          title: episode.title,
        };
      });
      this.navController.push(viewer, { items: items, slug: this.slug });
    }
  }

  /**
   * Play the current media
   *
   * @return void
   */
  playMedia() {
    if (!this.media) {
      return;
    }
    const viewer = this.getViewer(this.media.mediaType);
    if ((this.media.mediaType === 'video') || (this.media.mediaType === 'audio')) {
      const item: AvPlayerItem = {
        url: this.media.filePath,
        playFirst: true,
        posterUrl: this.media.imagePath,
        type: this.media.mediaType,
      };
      this.navController.push('av-player', { items: [item], slug: this.slug });
    } else if (this.media.mediaType === 'html') {
      window.open(this.media.filePath);
    } else if (viewer !== '') {
      const item: ViewerItem = {
        downloadPath: this.media.downloadPath,
        filePath: this.media.filePath,
        isFirst: true,
        title: this.media.title,
      };
      this.navController.push(viewer, { items: [item], slug: this.slug });
    }
  }

  /**
   * Open the language popover
   *
   * @param   event The event that triggered it
   * @return void
   */
  openLanguagePopover(event) {
    this.popoverController.config.set('mode', 'ios');
    const popover = this.popoverController.create(LanguagePopoverComponent);
    popover.present({ ev: event });
  }

  /**
   * Determine which viewer to use
   *
   * @param  mediaType The media type of the resource
   * @return           The viewer name or empty string
   */
  private getViewer(mediaType: string): string {
    const viewer = `${mediaType}-viewer`;
    return (this.availableViewers.indexOf(viewer) !== -1) ? viewer : '';
  }

  /**
   * Load the page data
   *
   * @param   language  The language to load
   * @return void
   */
  private loadData(language: Language) {
    if ((this.currentLanguage) && (language.text === this.currentLanguage.text)) {
      return;
    }
    this.currentLanguage = language;
    this.mediaDetailProvider.setLanguage(language.twoLetterCode);
    this.mediaDetailProvider
      .get(this.slug)
      .pipe(take(1))
      .subscribe((media: Media) => this.media = media);
  }

}

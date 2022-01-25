import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
import { switchMap } from 'rxjs/operators/switchMap';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { FileUtilityProvider } from '@providers/file-utility/file-utility';
import { LanguageProvider } from '@providers/language/language';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';
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
   * Can the user download the media file?  Specifically for HTML archives,
   * we need to verify it is on the device.  All other media should be there,
   * or play will also fail.
   */
  canDownloadMedia = true;

  /**
   * The current media
   */
  media: Media = null;

  /**
   * The current slug
   */
  slug = '';

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
    private fileUtilityProvider: FileUtilityProvider,
    private languageProvider: LanguageProvider,
    private mediaDetailProvider: MediaDetailProvider,
    private navController: NavController,
    private navParams: NavParams,
    private popoverController: PopoverController,
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
   * @param  fileName         The name of the file when downloaded
   *
   * @return         void
   * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
   */
  downloadFile(fileToDownload: string, fileName: string) {
    this.downloadFileProvider.download(fileToDownload).pipe(take(1)).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
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
  hasPlayer(mediaType: string, isEpisode: boolean = false): boolean {
    if (isEpisode) {
      return (['pdf', 'epub', 'video', 'audio', 'text'].indexOf(mediaType) !== -1);
    } else {
      return (['pdf', 'epub', 'video', 'audio', 'html', 'text'].indexOf(mediaType) !== -1);
    }
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
    let viewer = '';
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
    } else if (current.mediaType === 'pdf') {
      viewer = 'pdf-viewer';
    } else if (current.mediaType === 'epub') {
      viewer = 'epub-viewer';
    } else if (current.mediaType === 'text') {
      viewer = 'text-viewer';
    }
    if (viewer !== '') {
      const item: ViewerItem = {
        title: current.title,
        path: current.filePath,
      };
      this.navController.push(viewer, { item: item, slug: this.slug });
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
    let viewer = '';
    if ((this.media.mediaType === 'video') || (this.media.mediaType === 'audio')) {
      const item: AvPlayerItem = {
        url: this.media.filePath,
        playFirst: true,
        posterUrl: this.media.imagePath,
        type: this.media.mediaType,
      };
      this.navController.push('av-player', { items: [item], slug: this.slug });
    } else if (this.media.mediaType === 'html') {
      window.open(`/assets/content/${this.currentLanguage.twoLetterCode}/html/${this.media.slug}/`);
    } else if (this.media.mediaType === 'pdf') {
      viewer = 'pdf-viewer';
    } else if (this.media.mediaType === 'epub') {
      viewer = 'epub-viewer';
    } else if (this.media.mediaType === 'text') {
      viewer = 'text-viewer';
    }
    if (viewer !== '') {
      const item: ViewerItem = {
        title: this.media.title,
        path: this.media.filePath,
      };
      this.navController.push(viewer, { item: item, slug: this.slug });
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
      .pipe(switchMap((media: Media)  =>  {
        this.media = media;
        if (media.mediaType === 'html') {
          return this.fileUtilityProvider.exists(media.filePath);
        }
        return of(true);
      }))
      .pipe(take(1))
      .subscribe((exists: boolean) => this.canDownloadMedia = exists);
  }

}

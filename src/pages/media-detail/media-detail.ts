import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { DownloadFileProvider } from '@providers/download-file/download-file';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';
import { Episode } from '@models/episode';
import { Media } from '@models/media';
import { AvPlayerItem } from '@providers/av-player-data-store/av-player-item.interface';
import { LanguagePopoverPage } from '@pages/language-popover/language-popover';

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

  constructor(
    private downloadFileProvider: DownloadFileProvider,
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
    this.mediaDetailProvider.get(this.slug).pipe(take(1)).subscribe((media: Media) => this.media = media);
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
   * Play the provided episode
   *
   * @param  episode The episode to play
   * @return         void
   */
  playEpisode(current: Episode) {
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
    if ((this.media.mediaType === 'video') || (this.media.mediaType === 'audio')) {
      const item: AvPlayerItem = {
        url: this.media.filePath,
        playFirst: true,
        posterUrl: this.media.imagePath,
        type: this.media.mediaType,
      };
      this.navController.push('av-player', { items: [item], slug: this.slug });
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
    const popover = this.popoverController.create(LanguagePopoverPage);
    popover.present({ ev: event });
  }

}

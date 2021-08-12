import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';
import { Episode } from '@models/episode';
import { Media } from '@models/media';
import { AvPlayerPage } from '@pages/av-player/av-player';
import { AvPlayerItem } from '@pages/av-player/av-player-item.interface';

/**
 * The detail page for a specific piece of media.
 */
@Component({
  selector: 'page-media-detail',
  templateUrl: 'media-detail.html',
})
export class MediaDetailPage {
  /**
   * The current media
   */
  media: Media = null;

  constructor(
    private mediaDetailProvider: MediaDetailProvider,
    private navController: NavController,
    private navParams: NavParams
  ) {}

  /**
   * Life cycle for Ionic
   *
   * @return void
   */
  ionViewWillEnter() {
    const slug = this.navParams.get('slug');
    this.mediaDetailProvider.get(slug).pipe(take(1)).subscribe((media: Media) => this.media = media);
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
      this.navController.push(AvPlayerPage, { items: items });
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
      this.navController.push(AvPlayerPage, { items: [item] });
    }
  }

}

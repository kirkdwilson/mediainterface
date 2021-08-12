import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { MediaDetailProvider } from '@providers/media-detail/media-detail';
import { Media } from '@models/media';

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

}

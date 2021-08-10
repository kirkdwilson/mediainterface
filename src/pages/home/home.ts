import { Component } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';
import { Media } from '../../models/media';
import { take } from 'rxjs/operators/take';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * Our media to display
   */
  media: Array<Media> = [];

  /**
   * A list of recommended media
   */
  recommended: Array<Media> = [];

  constructor(
    private mediaProvider: MediaProvider
  ) {}

  /**
   * Ionic LifeCycle the view will enter
   *
   * @return void
   */
  ionViewWillEnter() {
    this.mediaProvider.all().pipe(take(1)).subscribe((media: Array<Media>) => {
      this.media = media;
      this.recommended = media.filter((resource) => resource.recommended);
    });
  }
}

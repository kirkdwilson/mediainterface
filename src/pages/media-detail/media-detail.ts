import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * The detail page for a specific piece of media.
 */
@Component({
  selector: 'page-media-detail',
  templateUrl: 'media-detail.html',
})
export class MediaDetailPage {
  /**
   * The slug for the given media
   */
  private slug = '';
  constructor(
    navParams: NavParams
  ) {
    this.slug = navParams.get('slug');
  }

  ionViewDidLoad() {
    console.log('slug', this.slug);
  }

}

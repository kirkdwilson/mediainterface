import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController } from 'ionic-angular';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { take } from 'rxjs/operators/take';
import { MediaProvider } from '@providers/media/media';
import { GroupedMedia } from '@providers/media/grouped-media.interface';
import { Category } from '@models/category';
import { Media } from '@models/media';
import { LanguagePopoverPage } from '@pages/language-popover/language-popover';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * Our media to display
   */
  groups: GroupedMedia = {};

  /**
   * The keys for groups (Remove Other)
   *
   */
  groupKeys: Array<string> = [];

  /**
   * A list of recommended media
   */
  recommended: Array<Media> = [];

  /**
   * A list of uncategorized media
   */
  others: Array<Media> = [];

  constructor(
    private mediaProvider: MediaProvider,
    private navController: NavController,
    private popoverController: PopoverController,
  ) {}

  /**
   * Ionic LifeCycle the view will enter
   *
   * @return void
   */
  ionViewWillEnter() {
    this.mediaProvider.recommended().pipe(
      mergeMap((recommended: Array<Media>) => {
        this.recommended = recommended;
        return this.mediaProvider.groupedByCategory(true);
      })
    ).pipe(
      take(1)
    ).subscribe((media: GroupedMedia) => {
      this.groups = media;
      this.others = this.groups['other'].media;
      this.groupKeys = Object.keys(media).filter((slug) => slug !== 'other');
    });
  }

  /**
   * Go to the media details page.
   *
   * @param  slug The slug of the media
   * @return      void
   */
  goToDetails(slug: string) {
    this.navController.push('media-details', { slug: slug });
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

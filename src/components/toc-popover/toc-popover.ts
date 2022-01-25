import { Component } from '@angular/core';
import { Events, NavParams, ViewController } from 'ionic-angular';
import { TocItem } from '@interfaces/toc-item.interface';

/**
 * Displays the table of contents for an ebook.
 */
@Component({
  selector: 'toc-popover',
  templateUrl: 'toc-popover.html'
})
export class TocPopoverComponent {

  /**
   * The provided table of contents
   */
  toc: Array<TocItem> = [];

  constructor(
    private events: Events,
    private viewController: ViewController,
    navParams: NavParams
  ) {
    this.toc = navParams.get('toc');
  }

  /**
   * Change to the given page.
   * @param  ref The reference to go to
   * @return     void
   */
  changePage(item: TocItem) {
    this.events.publish('toc-popover:change-page', item);
    this.viewController.dismiss();
  }

}

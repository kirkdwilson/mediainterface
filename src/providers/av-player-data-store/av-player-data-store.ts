import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { AvPlayerItem } from './av-player-item.interface';

/**
 * This data store handles the audio and video files to be played in the AV Player.
 * We mainly use the store to save the content on page refreshing.
 *
 * @link https://forum.ionicframework.com/t/page-refresh-makes-navparams-undefined-persist-navparams-on-page-refresh/95043
 */
@Injectable()
export class AvPlayerDataStoreProvider {

  /**
   * The index of the current playing item
   */
  currentIndex: number = 0;

  /**
   * The item to be played
   */
  items: Array<AvPlayerItem> = [];

  /**
   * The storage key that stores the file.
   */
  storageKey = 'av-player-data';

  /**
   * Build the provider.
   *
   * @param storage The storage library
   */
  constructor(
    private storage: Storage
  ) {}

  /**
   * Initialize the store.
   *
   * @param  items The items to store
   *
   * @return       The current item
   */
  init(items: Array<AvPlayerItem>): Observable<AvPlayerItem> {
    if (typeof items === 'undefined') {
      // We already have items
      return from(this.storage.get(this.storageKey)).pipe(map((data: any) => {
        if (!data) {
          return null;
        }
        this.items = JSON.parse(data);
        this.currentIndex = this.items.findIndex((item) => item.playFirst);
        return this.getCurrent();
      }));
    }
    this.items = items;
    this.currentIndex = this.items.findIndex((item) => item.playFirst);
    return this.save().pipe(map(() => this.getCurrent()));
  }

  /**
   * Clear out the data store.
   *
   * @return void
   */
  clear() {
    this.storage.remove(this.storageKey);
    this.items = [];
    this.currentIndex = 0;
  }

  /**
   * Get the item that needs to be played
   *
   * @return the item to play
   */
  getCurrent(): AvPlayerItem {
    return this.items[this.currentIndex];
  }

  /**
   * Do we still have more to show?
   *
   * @return yes|no
   */
  hasMore(): boolean {
    return ((this.currentIndex + 1) < this.items.length);
  }

  /**
   * Get the next item.  Returns null if we are on the last item.
   *
   * @return The next item
   */
  next(): Observable<AvPlayerItem> {
    if (this.onLastItem()) {
      return of(null);
    }
    this.currentIndex += 1;
    const current = this.items[this.currentIndex];
    this.items.forEach((item) => item.playFirst = false);
    this.items[this.currentIndex].playFirst = true;
    return this.save().pipe(map(() => current));
  }

  /**
   * Is this the first item in the list?
   *
   * @return yes|no
   */
  onFirstItem(): boolean {
    return (this.currentIndex === 0);
  }

  /**
   * Is this the last item in the list?
   *
   * @return yes|no
   */
  onLastItem(): boolean {
    return ((this.currentIndex + 1) === this.items.length);
  }

  /**
   * Get the previous file.  Returns null if we are on the last item.
   *
   * @return The previous item
   */
  previous(): Observable<AvPlayerItem> {
    if (this.onFirstItem()) {
      return of(null);
    }
    this.currentIndex -= 1;
    const current = this.items[this.currentIndex];
    this.items.forEach((item) => item.playFirst = false);
    this.items[this.currentIndex].playFirst = true;
    return this.save().pipe(map(() => current));
  }

  /**
   * Store the items in storage.
   *
   * @return void
   */
  private save(): Observable<void> {
    return from(this.storage.set(this.storageKey, JSON.stringify(this.items)));
  }

}

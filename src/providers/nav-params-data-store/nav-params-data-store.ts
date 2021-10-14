import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

/**
 * A data store keeping in memory a file that the user is looking at.
 *
 * When the page is refreshed, we lose access to files that were passed in the nav params.
 * This will store it, and provide a way to retrieve it.
 */
@Injectable()
export class NavParamsDataStoreProvider {

  /**
   * A prefix appended to the storage key
   */
  prefix = 'np-store-';

  /**
   * Build the provider.
   *
   * @param storage The storage library
   */
  constructor(
    private storage: Storage
  ) {}

  /**
   * Get the nav params based on the key
   *
   * @param  key The key to use
   * @return     The value stored
   */
  get(key: string): Observable<string> {
    const storeKey = this.getStoreKey(key);
    return from(this.storage.get(storeKey)).pipe(catchError(() => of('')));
  }

  /**
   * Remove the data from the store.
   *
   * @param  key The key to use
   * @return     Was it removed?
   */
  remove(key: string): Observable<boolean> {
    const storeKey = this.getStoreKey(key);
    return from(this.storage.remove(storeKey)).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
  /**
   * Store the nav params data
   *
   * @param  key   The key to use
   * @param  value The value of the nav params
   * @return       was it successful?
   */
  store(key: string, value: string): Observable<boolean> {
    const storeKey = this.getStoreKey(key);
    return from(this.storage.set(storeKey, value)).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  /**
   * Get the store key with the prefix
   *
   * @param  key The key to use
   * @return     The store key
   */
  private getStoreKey(key: string): string {
    return `${this.prefix}${key}`;
  }

}

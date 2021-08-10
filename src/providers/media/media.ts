import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

/**
 * A provider for retrieving the media for the specified language.
 */
@Injectable()
export class MediaProvider {
  /**
   * The current language
   */
  private language = 'en';

  /**
   * The path to the data files "{lang}" will be replaced with 2 letter language code.
   */
  private dataPath = 'assets/content/{lang}/data/';

  constructor(private http: HttpClient) {}

  all(): Observable<void> {
    return Observable.of();
  }

}

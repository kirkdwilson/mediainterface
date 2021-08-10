import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';
import { Media } from '../../models/media';
import { environment } from '@env';

/**
 * A provider for retrieving the media for the specified language.
 */
@Injectable()
export class MediaProvider {

  /**
   * The media files retrieved from the main.json file
   */
  private media: Array<Media> = [];

  /**
   * The current language
   */
  private language = 'en';

  constructor(private http: HttpClient) {}

  /**
   * Set the language
   *
   * @param  language The two letter iso code
   * @return          void
   */
  setLanguage(language: string) {
    // Clear the cache
    this.media = [];
    this.language = language;
  }

  /**
   * Retrieve all the media from the main json file.
   *
   * @return The Media files
   */
  all(): Observable<Array<Media>> {
    if (this.media.length > 0) {
      return of(this.media);
    }

    const path = `${environment.assetPath.replace('{LANG}', this.language)}data/main.json`;
    return this.http.get(path).pipe(
      map((response: any) => {
        if (
          (!response) ||
          (!response.hasOwnProperty('content')) ||
          (response.content.length === 0) ||
          (!response.content[0].hasOwnProperty('content'))
        ) {
          return [];
        }
        this.media = response.content[0].content.map((media) => {
          const recommended = (media.hasOwnProperty('recommended')) ? media.recommended : false;
          return new Media(
            media.categories,
            media.desc,
            media.image,
            media.mediaType,
            media.slug,
            media.title,
            this.language,
            recommended,
            media.tags
          );
        })
        return this.media;
      })
    );
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';
import { GroupedMedia } from './grouped-media.interface';
import { Category } from '@models/category';
import { Media } from '@models/media';
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
   * Retrieve all the media from the main json file.
   *
   * @return The Media files
   */
  all(): Observable<Array<Media>> {
    return this.loadMedia();
  }

  /**
   * Get all the media grouped by it's category.
   *
   * @param sorted  Do you want to sort the keys?
   *
   * @return The media grouped
   */
  groupedByCategory(sorted = false): Observable<GroupedMedia> {
    return this.loadMedia().pipe(
      map((media: Array<Media>) => {
        const groups: GroupedMedia = media.reduce(
          (groups, item) => {
            if (item.categories.length === 0) {
              const group = (groups['other'] || {label: 'Other', media: []});
              group.media.push(item);
              groups['other'] = group;
              return groups;
            }
            item.categories.forEach((category: Category) => {
              const group = (groups[category.slug] || {label: category.name, media: []});
              group.media.push(item);
              groups[category.slug] = group;
            });
            return groups;
          },
          {}
        );
        // Sort by the key
        if (!sorted) {
          return groups;
        }
        return Object.keys(groups).sort().reduce((result, key) => {
          result[key] = groups[key];
          return result;
        }, {});
      })
    );
  }

  /**
   * Get a list of all recommended media. The keys of the array are the
   * category slugs.
   *
   * @return The recommended media
   */
  recommended(): Observable<Array<Media>> {
    return this.loadMedia()
    .pipe(
      map((media: Array<Media>) => media.filter((resource) => resource.recommended))
    );
  }

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
   * load the intial media data.
   *
   * @return The media data
   */
  private loadMedia(): Observable<Array<Media>> {
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
          const fileName = (media.hasOwnProperty('filename')) ? media.filename : '';
          let categories = [];
          if (media.categories.length > 0) {
            categories = media.categories.map((category) => new Category(category));;
          }
          return new Media(
            categories,
            media.desc,
            media.image,
            media.mediaType,
            media.slug,
            media.title,
            this.language,
            recommended,
            fileName,
            media.tags
          );
        })
        return this.media;
      })
    );
  }

}

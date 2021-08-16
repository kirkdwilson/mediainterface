import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { Language } from '@models/language';
import { environment } from '@env';

/**
 * A provider for setting and tracking available languages
 */
@Injectable()
export class LanguageProvider {
  /**
   * The supported languages
   */
  public languages: Array<Language> = [];

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Get a list of all the supported languages
   *
   * @return The languages
   */
  supported(): Observable<Array<Language>> {
    return this.load();
  }

  /**
   * Load the supported languages.
   *
   * @return The supported languages
   */
  private load(): Observable<Array<Language>> {
    if (this.languages.length > 0) {
      return of(this.languages);
    }
    const path = environment.languagePath;
    return this.http.get(path).pipe(
      map((response: any) => {
        if (!response) {
          return [];
        }
        return response.map((lang: any) => new Language(lang.codes, lang.text, lang.default));
      })
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
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
  languages: Array<Language> = [];

  /**
   * When the language changes, this will notify users.
   */
  onLanguageChange: Observable<Language>;

  /**
   * The storage key that stores the file.
   */
  storageKey = 'language';

  /**
   * The current selected language
   */
  private currentLanguage: Language = null;

  /**
   * The subject for traking changes to the language
   */
  private languageSubject: Subject<Language>;

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    this.languageSubject = new Subject();
    this.onLanguageChange = this.languageSubject.asObservable();
  }

  /**
   * Get the default supported language.
   *
   * @return The default language
   */
  getDefaultLanguage(): Observable<Language> {
    return this.load().pipe(
      map((supported: Array<Language>) => supported.find((lang) => lang.isDefault))
    );
  }

  /**
   * Save the new language selected.
   *
   * @param  language The selected language
   * @return          Was it saved?
   */
  saveLanguage(language: Language): Observable<boolean> {
    return this.load().pipe(
      switchMap((supported: Array<Language>) => {
        const found = supported.find((lang: Language) => lang.text.toLowerCase() === language.text.toLowerCase());
        if (!found) {
          return of(false);
        }
        this.currentLanguage = found;
        this.languageSubject.next(found);
        return from(
          this.storage.set(this.storageKey, JSON.stringify(found))
        ).pipe(map(() => true));
      })
    );
  }

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

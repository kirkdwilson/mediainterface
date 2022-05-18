import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { environment } from '@env';

/**
 * A provider that handles reporting viewership stats to the backend API.
 */
@Injectable()
export class StatReporterProvider {
  /**
   * Do you want to collect stats?
   */
  collectStats = true;

  /**
   * Build the class
   *
   * @param http  Angular's http client
   */
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Report interaction with the frontend
   *
   * @param  identifier     The media's identifier
   * @param  interaction    The type of interaction (download or view)
   * @param  language       The current language
   * @param  mediaProvider  The media provider
   * @param  mediaType      The type of media
   * @return                Was it successful?
   */
  report(
    identifier: string,
    interaction: string,
    language: string,
    mediaProvider: string,
    mediaType: string,
  ): Observable<boolean> {
    if (!this.collectStats) {
      return of(false);
    }
    if (environment.reportingEndpoint === '') {
      return of(false);
    }
    if (['download', 'view'].indexOf(interaction) === -1) {
      return of(false);
    }
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const body = {value: {
      interactionType: interaction,
      mediaIdentifier: identifier,
      mediaLanguage: language,
      mediaProvider: mediaProvider,
      mediaType: mediaType,
      timestamp: timestamp,
    }};
    return this.http.put(environment.reportingEndpoint, body).pipe(
      map(()  =>  true),
      catchError(() =>  of(false))
    );
  }

}

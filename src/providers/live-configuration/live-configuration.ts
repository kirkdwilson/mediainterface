import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { environment } from '@env';

/**
 * This provider loads configurations in assets directory if it exists.
 * This provides a way to set specific configurations without building the code base.
 * We currently support the following keys:
 *
 * disable_openwell_chat/disable_chat: Disables the chat functionality.
 * disable_stats: Disable the collecting of stats.
 */
@Injectable()
export class LiveConfigurationProvider {

  /**
   * Do we allow chatting?
   */
  private chatEnabled = true;

  /**
   * Are we collecting stats?
   */
  private statsEnabled = true;

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Do we allow chatting?
   *
   * @return yes|no
   */
  get allowsChat(): boolean {
    return this.chatEnabled;
  }

  /**
   * Do we collect stats?
   *
   * @return yes|no
   */
  get collectingStats(): boolean {
    return this.statsEnabled;
  }

  /**
   * load the configurations
   *
   * @return void
   */
  init(): Observable<void> {
    return this.load().pipe(map((response: any) =>  {
        if (response && response.hasOwnProperty('disable_openwell_chat')) {
          this.chatEnabled = (!response.disable_openwell_chat);
        }
        if (response && response.hasOwnProperty('disable_chat')) {
          this.chatEnabled = (!response.disable_chat);
        }
        if (response && response.hasOwnProperty('disable_stats')) {
          this.statsEnabled = (!response.disable_stats);
        }
        return null;
    }));
  }

  /**
   * Load the configuration file
   *
   * @return void
   */
  private load(): Observable<any> {
    if (environment.liveConfigFile === '') {
      return of(null);
    }
    return this.http.get(environment.liveConfigFile).pipe(catchError(() =>  of(null)));
  }

}

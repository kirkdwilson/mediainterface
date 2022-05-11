import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
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
  ) {
    this.load();
  }

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
   * Load the configuration file
   *
   * @return void
   */
  private load() {
    if (environment.liveConfigFile === '') {
      return;
    }
    this.http.get(environment.liveConfigFile).pipe(
      take(1),
      catchError(() =>  of(null)),
    ).subscribe((response: any) =>  {
      if (response && response.hasOwnProperty('disable_openwell_chat')) {
        this.chatEnabled = (!response.disable_openwell_chat);
      }
      if (response && response.hasOwnProperty('disable_chat')) {
        this.chatEnabled = (!response.disable_chat);
      }
      if (response && response.hasOwnProperty('disable_stats')) {
        this.statsEnabled = (!response.disable_stats);
      }
    });
  }

}

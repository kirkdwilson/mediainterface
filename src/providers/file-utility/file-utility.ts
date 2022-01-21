import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

/**
 * A provider for setting and tracking available languages
 */
@Injectable()
export class FileUtilityProvider {

  constructor(private http: HttpClient) {}

  exists(filePath: string): Observable<boolean> {
    return this.http.get(
      filePath,
      { observe: 'response', responseType: 'blob'}
    ).pipe(
      map((response)  =>  true)
    ).pipe(
      catchError((response) =>  of(false))
    );
  }
}

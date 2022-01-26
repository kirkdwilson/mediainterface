import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

/**
 * A provider for doing various file utilities
 */
@Injectable()
export class FileUtilityProvider {

  constructor(private http: HttpClient) {}

  /**
   * Check if a file exists.
   *
   * @param  filePath The path to check
   * @return          yes|no
   */
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

  /**
   * Read the contents of a file
   *
   * @param  filePath The path to the file to read
   * @return          The contents of the file
   */
  read(filePath: string): Observable<string> {
    return this.http.get(
      filePath,
      { responseType: 'text' }
    ).pipe(
      map((response)  =>  response)
    );
  }
}

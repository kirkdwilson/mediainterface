import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 * Download a file using Javascript.
 *
 * @link https://www.illucit.com/en/angular/angular-5-httpclient-file-download-with-authentication/
 */
@Injectable()
export class DownloadFileProvider {

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Download the file.
   *
   * @param   file  The path to the file to download.
   *
   * @return The blob that you should use window.URL.createObjectURL to create the url to download
   */
  download(file: string): Observable<any> {
    return this.http.get<Blob>(file, { responseType: 'blob' as 'json' });
  }

}

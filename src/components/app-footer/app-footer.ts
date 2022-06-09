import { environment } from '@env';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators/take';

/**
 * This adds HTML in the footer pulling it from assets/content/footer.html.  If it
 * is missing or empty nothing shows.  If it is not empy, it adds a wrapper class
 * custom-footer.
 */
@Component({
  selector: 'app-footer',
  templateUrl: 'app-footer.html'
})
export class AppFooterComponent {

  /**
   * The HTML content to display in the footer.
   */
  content = '';

  /**
   * The class for the wrapper div
   */
  divClass = 'custom-footer-nc';

  constructor(http: HttpClient) {
    const footerPath = `${environment.assetPath.replace('{LANG}/', '')}footer.html`;
    http.get(footerPath, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (response: string) => {
          if (response !== '') {
            this.divClass = 'custom-footer';
          }
          this.content = response;

          // Look in the usual place for Moodle, if found, show links in the footer
          const hostname = window.location.hostname;
          const moodlePath = '/admin/api/ismoodle';
          console.log(moodlePath);
          http.get(moodlePath, { responseType: 'text' })
            .pipe(take(1))
            .subscribe(
              (response: string) => {
                // There is a Moodle here!!!
                // Modify the content to show content
                this.content = this.content.replace(/ hidden/g,'');
                this.content = this.content.replace(/DOMAIN/g,hostname);
              }
            );
        },
        (err) => this.content = ''
      );
  }

}

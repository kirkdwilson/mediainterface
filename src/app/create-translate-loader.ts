import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/**
 * Set the custom path to the translated interface files.
 *
 * @param  http The HTTP Client
 * @return The loder
 */
export function CreateTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/content/', '/data/interface.json');
}

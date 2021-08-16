import { Injectable } from '@angular/core';

@Injectable()
export class TranslateServiceMock {
  getBrowserLang(): string {
    return '';
  }

  getBrowserCultureLang(): string {
    return '';
  }
}

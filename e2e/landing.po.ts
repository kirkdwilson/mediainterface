import { browser, by, element } from 'protractor';

export class Page {

  navigateTo(destination) {
    browser.waitForAngularEnabled(false);
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

}

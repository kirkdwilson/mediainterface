import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  /**
   * The root page
   */
  rootPage: string = 'HomePage';

  constructor(
    private translate: TranslateService
  ) {}

  /**
   * The class is intialized
   *
   * @return void
   */
  ngOnInit() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

}

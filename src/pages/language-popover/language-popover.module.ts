import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LanguagePopoverPage } from './language-popover';
import { LanguageProvider } from '@providers/language/language';

@NgModule({
  declarations: [
    LanguagePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(LanguagePopoverPage),
  ],
  providers: [LanguageProvider],
})
export class LanguagePopoverPageModule {}

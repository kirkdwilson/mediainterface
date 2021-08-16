import { async, inject } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { StorageMock } from '@mocks/ionic/storage';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { LanguageProvider } from './language';
import { Language } from '@models/language';
import { environment } from '@env';

describe('LanguageProvider', () => {
  let app: AppTestingModule;
  let storage : StorageMock;
  const mockedResponse: any = [
    {
      text: 'English',
      codes: ['en-US', 'en'],
      default: true,
    },
    {
      text: 'Español',
      codes: ['es'],
      default: false,
    },
    {
      text: '今日未得之民',
      codes: ['zh', 'zh-HANT', 'zh-HK', 'zh-TO', 'zh-MO'],
      default: false,
    }
  ];

  describe('methods', () => {

    describe('supported()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          app.configure([], [
            LanguageProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return the supported languages', async(inject([LanguageProvider], (languageProvider) => {
        languageProvider.supported().pipe(take(1)).subscribe((languages: Array<Language>) => {
          expect(languages).not.toBeNull();
          expect(languages.length).toEqual(3);
          const titles = languages.map((language: Language) => language.text);
          expect(titles).toEqual(['English', 'Español', '今日未得之民']);
        });
        const request = app.httpMock.expectOne(environment.languagePath);
        request.flush(mockedResponse);
      })));


    });

  });

});

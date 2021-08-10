import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import 'rxjs/add/operator/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { MediaProvider } from './media';

describe('MediaProvider', () => {
  let app: AppTestingModule;

  describe('methods', () => {

    describe('all()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [MediaProvider], true);
      });

    });

  });

});

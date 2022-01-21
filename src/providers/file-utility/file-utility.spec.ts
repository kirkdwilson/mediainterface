import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { FileUtilityProvider } from './file-utility';

describe('FileUtilityProvider', ()  =>  {
  let app: AppTestingModule;

  describe('methods', ()  =>  {

    beforeEach(() => {
        app = new AppTestingModule();
        app.configure([], [
          FileUtilityProvider
        ], true);
    });

    it('should return true', async(inject([FileUtilityProvider], (fileUtilityProvider) =>  {
      fileUtilityProvider.exists('http://iexist.com/help.txt').pipe(take(1)).subscribe((exists: boolean) => {
        expect(exists).toBeTruthy();
      });
      const request = app.httpMock.expectOne('http://iexist.com/help.txt');
      request.flush(new Blob());
    })));

    it('should return false', async(inject([FileUtilityProvider], (fileUtilityProvider) =>  {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      fileUtilityProvider.exists('http://iexist.com/no-help.txt').pipe(take(1)).subscribe((exists: boolean) => {
        expect(exists).toBeFalsy();
      });
      const request = app.httpMock.expectOne('http://iexist.com/no-help.txt');
      request.flush(new Blob(), mockErrorResponse);
    })));

  });
});

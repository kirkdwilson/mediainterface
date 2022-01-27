import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { FileUtilityProvider } from './file-utility';

describe('FileUtilityProvider', ()  =>  {
  let app: AppTestingModule;

  describe('methods', ()  =>  {

    describe('exists()', () =>  {

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

    describe('read()', () =>  {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [
            FileUtilityProvider
          ], true);
      });

      it('should get the file contents', async(inject([FileUtilityProvider], (fileUtilityProvider)  =>  {
        const response = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        fileUtilityProvider.read('special-file/my-file.txt').pipe(take(1)).subscribe((content) =>  {
          expect(content).toEqual(response);
        });
        const request = app.httpMock.expectOne('special-file/my-file.txt');
        request.flush(response);
      })));

    });

  });
});

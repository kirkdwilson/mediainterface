import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { StatReporterProvider } from './stat-reporter';
import { environment } from '@env';

describe('StatReporterProvider', () =>  {
  let app: AppTestingModule;

  describe('methods', ()  =>  {

    describe('report()', () =>  {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [
            StatReporterProvider,
          ], true);
      });

      it('should report the interaction', async(inject([StatReporterProvider], (statReporterProvider) =>  {
        statReporterProvider.collectStats = true;
        statReporterProvider.report('best-cat-videos', 'download', 'en', 'video').pipe(take(1)).subscribe((success: boolean)  =>  {
          expect(success).toBeTruthy();
        });

        const request = app.httpMock.expectOne({method: 'PUT', url: environment.reportingEndpoint});
        const body = request.request.body;
        expect(body.interactionType).toEqual('download');
        expect(body.mediaIdentifier).toEqual('best-cat-videos');
        expect(body.mediaLanguage).toEqual('en');
        expect(body.mediaProvider).toEqual('');
        expect(body.mediaType).toEqual('video');
        request.flush({});
      })));

      it('should report nothing if wrong interaction provided', async(inject([StatReporterProvider], (statReporterProvider) =>  {
        statReporterProvider.collectStats = true;
        statReporterProvider.report('best-dog-videos', 'played', 'en', 'video').pipe(take(1)).subscribe((success: boolean)  =>  {
          expect(success).toBeFalsy();
        });

        app.httpMock.expectNone({method: 'PUT', url: environment.reportingEndpoint});
      })));

      it('should report nothing if we are not collecting stats', async(inject([StatReporterProvider], (statReporterProvider)  =>  {
        statReporterProvider.collectStats = false;
        statReporterProvider.report('best-koala-videos', 'download', 'en', 'video').pipe(take(1)).subscribe((success: boolean)  =>  {
          expect(success).toBeFalsy();
        });

        app.httpMock.expectNone({method: 'PUT', url: environment.reportingEndpoint});
      })));

    });

  });

});

import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { LiveConfigurationProvider } from './live-configuration';
import { environment } from '@env';

describe('LiveConfigurationProvider', ()  =>  {
  let app: AppTestingModule;

  beforeEach(() => {
      app = new AppTestingModule();
      app.configure([], [
        LiveConfigurationProvider,
      ], true);
  });

  describe('loading', ()  =>  {

    it('should load settings from file', async(inject([LiveConfigurationProvider], (liveConfigurationProvider)  =>  {
      const response: any = {
        disable_openwell_chat: true,
        disable_stats: true,
      };
      const request = app.httpMock.expectOne(environment.liveConfigFile);
      request.flush(response);
      expect(liveConfigurationProvider.allowsChat).toBeFalsy();
      expect(liveConfigurationProvider.collectingStats).toBeFalsy();
    })));

    it('should keep defaults if file is missing', async(inject([LiveConfigurationProvider], (liveConfigurationProvider)  =>  {
      const response = { status: 400, statusText: 'Bad Request' };
      const request = app.httpMock.expectOne(environment.liveConfigFile);
      request.flush('', response);
      expect(liveConfigurationProvider.allowsChat).toBeTruthy();
      expect(liveConfigurationProvider.collectingStats).toBeTruthy();
    })));

    it('should handle different key for chat', async(inject([LiveConfigurationProvider], (liveConfigurationProvider)  =>  {
      const response: any = {
        disable_chat: true,
      };
      const request = app.httpMock.expectOne(environment.liveConfigFile);
      request.flush(response);
      expect(liveConfigurationProvider.allowsChat).toBeFalsy();
      expect(liveConfigurationProvider.collectingStats).toBeTruthy();
    })));

  });

});

import { async, inject } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { StorageMock } from '@mocks/ionic/storage';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { NavParamsDataStoreProvider } from './nav-params-data-store';

describe('NavParamsDataStoreProvider', () => {
  let app: AppTestingModule;
  let storage : StorageMock;

  describe('methods', () => {

    describe('store()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          app.configure([], [
            NavParamsDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should store the nav params', async((inject([NavParamsDataStoreProvider], (storeProvider) => {
        const data = JSON.stringify({ file: 'my-file-name.jpg'});
        storeProvider.store('test-1', data).pipe(take(1)).subscribe((success) => {
          expect(success).toBe(true);
          expect(storage.set).toHaveBeenCalled();
          expect(storage.set).toHaveBeenCalledWith(`${storeProvider.prefix}test-1`, data);
        });
      }))));

    });

    describe('get()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'get').and.returnValue(
            new Promise(
              (resolve) => {
                resolve(JSON.stringify({ special: 'my-ice-cream'}));
              }
            )
          );
          app.configure([], [
            NavParamsDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return the value', async(inject([NavParamsDataStoreProvider], (storeProvider) => {
        storeProvider.get('test-2').pipe(take(1)).subscribe((value: string) => {
          expect(value).not.toBeNull();
          expect(value).toEqual(JSON.stringify({ special: 'my-ice-cream'}));
          expect(storage.get).toHaveBeenCalled();
          expect(storage.get).toHaveBeenCalledWith(`${storeProvider.prefix}test-2`);
        });

      })));

    });

    describe('remove()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'remove').and.callThrough();
          app.configure([], [
            NavParamsDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should remove the given value', async(inject([NavParamsDataStoreProvider], (storeProvider) => {
        storeProvider.remove('test-3').pipe(take(1)).subscribe((success: boolean) => {
          expect(success).toBe(true);
          expect(storage.remove).toHaveBeenCalled();
          expect(storage.remove).toHaveBeenCalledWith(`${storeProvider.prefix}test-3`);
        });
      })));

    });

  });

});

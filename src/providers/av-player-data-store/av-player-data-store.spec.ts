import { async, inject } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { zip } from 'rxjs/observable/zip';
import { StorageMock } from '@mocks/ionic/storage';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { AvPlayerDataStoreProvider } from './av-player-data-store';
import { AvPlayerItem } from '@interfaces/av-player-item.interface';

describe('AvPlayerDataStoreProvider', () => {
  let app: AppTestingModule;
  let storage : StorageMock;
  const items: Array<AvPlayerItem> = [
    {
      playFirst: false,
      url: 'first/item.mp4',
      posterUrl: 'first/item.jpg',
      type: 'video',
    },
    {
      playFirst: true,
      url: 'second/item.mp4',
      posterUrl: 'second/item.jpg',
      type: 'video',
    },
    {
      playFirst: false,
      url: 'third/item.mp4',
      posterUrl: 'third/item.jpg',
      type: 'video',
    },
    {
      playFirst: false,
      url: 'fourth/item.mp4',
      posterUrl: 'fourth/item.jpg',
      type: 'video',
    },
  ];

  describe('methods', () => {

    describe('init()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          spyOn(storage, 'get').and.returnValue(
            new Promise(
              (resolve) => {
                resolve(JSON.stringify(items));
              }
            )
          );
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should set the items and return current', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        dataStore.init(items).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(storage.set).toHaveBeenCalledWith(dataStore.storageKey, JSON.stringify(items));
          expect(current.url).toEqual('second/item.mp4');
        });
      })));

      it('should retrieve the items from storage if provided undefined', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        dataStore.init(undefined).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(storage.get).toHaveBeenCalledWith(dataStore.storageKey);
          expect(storage.set).not.toHaveBeenCalled();
          expect(current.url).toEqual('second/item.mp4');
        });
      })));

    });

    describe('hasMore()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return true', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[2].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('third/item.mp4');
          expect(dataStore.hasMore()).toBe(true);
        });
      })));

      it('should return false', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[3].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('fourth/item.mp4');
          expect(dataStore.hasMore()).toBe(false);
        });
      })));

    });

    describe('next()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return the next item', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[2].playFirst = true;
        zip(
          dataStore.init(media).pipe(take(1)),
          dataStore.next().pipe(take(1)),
        ).subscribe(([_, next]) => {
          expect(next.url).toEqual('fourth/item.mp4');
          expect(storage.set).toHaveBeenCalledTimes(2);
        });
      })));

      it('should return null on last item', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[3].playFirst = true;
        zip(
          dataStore.init(media).pipe(take(1)),
          dataStore.next().pipe(take(1)),
        ).subscribe(([_, next]) => {
          expect(next).toBeNull();
          expect(storage.set).toHaveBeenCalledTimes(1);
        });
      })));

    });

    describe('previous()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return the previous item', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[2].playFirst = true;
        zip(
          dataStore.init(media).pipe(take(1)),
          dataStore.previous().pipe(take(1)),
        ).subscribe(([_, prev]) => {
          expect(prev.url).toEqual('second/item.mp4');
          expect(storage.set).toHaveBeenCalledTimes(2);
        });
      })));

      it('should return null on first item', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[0].playFirst = true;
        zip(
          dataStore.init(media).pipe(take(1)),
          dataStore.previous().pipe(take(1)),
        ).subscribe(([_, prev]) => {
          expect(prev).toBeNull();
          expect(storage.set).toHaveBeenCalledTimes(1);
        });
      })));

    });

    describe('onLastItem()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return true', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[3].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('fourth/item.mp4');
          expect(dataStore.onLastItem()).toBe(true);
        });
      })));

      it('should return false', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[2].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('third/item.mp4');
          expect(dataStore.onLastItem()).toBe(false);
        });
      })));

    });

    describe('onFirstItem()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          storage = new StorageMock();
          spyOn(storage, 'set').and.callThrough();
          app.configure([], [
            AvPlayerDataStoreProvider,
            { provide: Storage, useValue: storage },
          ], true);
      });

      it('should return true', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[0].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('first/item.mp4');
          expect(dataStore.onFirstItem()).toBe(true);
        });
      })));

      it('should return false', async(inject([AvPlayerDataStoreProvider], (dataStore) => {
        // clone
        const media = JSON.parse(JSON.stringify(items));
        media.forEach((item) => item.playFirst = false);
        media[1].playFirst = true;
        dataStore.init(media).pipe(take(1)).subscribe((current: AvPlayerItem) => {
          expect(current.url).toEqual('second/item.mp4');
          expect(dataStore.onFirstItem()).toBe(false);
        });
      })));

    });

  });

});

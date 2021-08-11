import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { MediaProvider } from './media';
import { Media } from '@models/media';

describe('MediaProvider', () => {
  let app: AppTestingModule;

  describe('methods', () => {

    describe('all()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [MediaProvider], true);
      });

      it('should return all', async(inject([MediaProvider], (mediaProvider) => {
        const response = {
          content: [
            {
              itemName: 'test response',
              content: [
                {
                  categories: ['New', 'Originals'],
                  recommended: true,
                  slug: 'glenn-ivy',
                  title: 'Glenn Ivy',
                  desc: 'A story about Glenn Ivy',
                  image: 'glenn-ivy.jpg',
                  mediaType: 'video',
                  tags: ['locations', 'unique', 'travel'],
                },
                {
                  categories: ['Specials'],
                  slug: 'ice-cream-special',
                  title: 'Ice Cream Special',
                  desc: 'A story about Ice Cream',
                  image: 'ice-cream.jpg',
                  mediaType: 'video',
                  tags: ['desserts', 'sweets'],
                }
              ]
            }
          ]
        };

        mediaProvider.all().pipe(take(1)).subscribe((data: Array<Media>) => {
          expect(data).not.toBeNull();
          expect(data.length).toEqual(2);
          const slugs = data.map((media) => media.slug);
          const glenn = data.find((media) => media.slug === 'glenn-ivy');
          const cream = data.find((media) => media.slug === 'ice-cream-special');
          expect(slugs.indexOf('glenn-ivy')).not.toEqual(-1);
          expect(slugs.indexOf('ice-cream-special')).not.toEqual(-1);
          expect(glenn.categories).toEqual(['New', 'Originals']);
          expect(glenn.recommended).toBe(true);
          expect(glenn.title).toEqual('Glenn Ivy');
          expect(glenn.desc).toEqual('A story about Glenn Ivy');
          expect(glenn.image).toEqual('glenn-ivy.jpg');
          expect(glenn.mediaType).toEqual('video');
          expect(glenn.tags).toEqual(['locations', 'unique', 'travel']);
          expect(glenn.language).toEqual('en');
          expect(cream.recommended).toBe(false);
        });

        const request = app.httpMock.expectOne('assets/content/en/data/main.json');
        request.flush(response);
      })));

    });

  });

});

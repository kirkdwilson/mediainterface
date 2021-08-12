import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { MediaDetailProvider } from './media-detail';
import { Category } from '@models/category';
import { Media } from '@models/media';

describe('MediaDetailProvider', () => {
  let app: AppTestingModule;

  describe('methods', () => {

    describe('get()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [MediaDetailProvider], true);
      });

      it('should return the media details', async(inject([MediaDetailProvider], (mediaDetailProvider) => {
        const response = {
          categories: ['Freedom', 'Originals'],
          slug: 'a-history-of-ice-cream',
          title: 'A History of Ice Cream',
          desc: 'A journey through the history of Ice Cream!',
          image: 'ice-cream.jpg',
          mediaType: 'video',
          tags: ['ice cream', 'episodic'],
          episodes: [
            {
              title: 'Sweet Cream',
              desc: 'The sweetest dessert!',
              filename: 'sweet-cream.mp4',
              image: 'sweet-cream.jpg',
              mediaType: 'video',
              order: 1
            },
            {
              title: 'Velvet Chocolate',
              desc: 'The tastiest chocolate creme.',
              filename: 'chocolate.mp4',
              image: 'chocolate.jpg',
              mediaType: 'video',
              order: 2
            },
            {
              title: 'Vivacious Vanilla',
              desc: 'The tastiest vanilla creme.',
              filename: 'vanilla.mp4',
              image: 'vanilla.jpg',
              mediaType: 'video',
              order: 3
            }
          ]
        };

        mediaDetailProvider.get('a-history-of-ice-cream').pipe(take(1)).subscribe((media: Media) => {
          expect(media).not.toBeNull();
          expect(media.title).toEqual('A History of Ice Cream');
          expect(media.desc).toEqual('A journey through the history of Ice Cream!');
          expect(media.image).toEqual('ice-cream.jpg');
          expect(media.categories).toEqual([new Category('Freedom'), new Category('Originals')]);
          expect(media.tags).toEqual(['ice cream', 'episodic']);
          expect(media.episodes.length).toEqual(3);
          const titles = media.episodes.map((ep) => ep.title);
          expect(titles).toEqual(['Sweet Cream', 'Velvet Chocolate', 'Vivacious Vanilla']);
          const sweet = media.episodes.find((ep) => ep.title === 'Sweet Cream');
          expect(sweet.desc).toEqual('The sweetest dessert!');
          expect(sweet.fileName).toEqual('sweet-cream.mp4');
          expect(sweet.image).toEqual('sweet-cream.jpg');
          expect(sweet.mediaType).toEqual('video');
        });

        const request = app.httpMock.expectOne('assets/content/en/data/a-history-of-ice-cream.json');
        request.flush(response);
      })));

    });

  });

});

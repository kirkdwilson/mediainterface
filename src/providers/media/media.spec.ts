import { async, inject } from '@angular/core/testing';
import {} from 'jasmine';
import { take } from 'rxjs/operators/take';
import { AppTestingModule } from '../../../test-config/app-testing-module';
import { MediaProvider } from './media';
import { GroupedMedia } from './grouped-media.interface';
import { Category } from '@models/category';
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
          const categorySlugs = glenn.categories.map((cat: Category) => cat.slug);
          expect(categorySlugs).toEqual(['new', 'originals']);
          expect(glenn.recommended).toBe(true);
          expect(glenn.title).toEqual('Glenn Ivy');
          expect(glenn.desc).toEqual('A story about Glenn Ivy');
          expect(glenn.image).toEqual('glenn-ivy.jpg');
          expect(glenn.mediaType).toEqual('video');
          expect(glenn.mimeType).toEqual('');
          expect(glenn.tags).toEqual(['locations', 'unique', 'travel']);
          expect(glenn.language).toEqual('en');
          expect(cream.recommended).toBe(false);
        });

        const request = app.httpMock.expectOne('assets/content/en/data/main.json');
        request.flush(response);
      })));

    });

    describe('groupedByCategory()', () => {

      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [MediaProvider], true);
      });

      it('should return the correct grouping', async(inject([MediaProvider], (mediaProvider) => {
        const response = {
          content: [
            {
              itemName: 'test response',
              content: [
                {
                  categories: ['New', 'Originals'],
                  recommended: true,
                  slug: 'newbies-welcome',
                  title: 'Newbies Welcome',
                  desc: 'A story about a Newbie finding belonging',
                  image: 'newby.jpg',
                  mediaType: 'video',
                  tags: ['newby', 'friends', 'connections'],
                },
                {
                  categories: ['originals'],
                  recommended: true,
                  slug: 'attack-of-the-shoe',
                  title: 'Attack of the Shoe',
                  desc: 'A story about a show that wants freedom',
                  image: 'shoe.jpg',
                  mediaType: 'video',
                  tags: ['fashion', 'shoes', 'freedom'],
                },
                {
                  categories: ['comedy'],
                  recommended: true,
                  slug: 'a-sneeze-is-a-breeze',
                  title: 'A Sneeze is a Breeze',
                  desc: 'A story about how to sneeze',
                  image: 'sneeze.jpg',
                  mediaType: 'pdf',
                  tags: ['sneezing', 'release'],
                },
                {
                  categories: [],
                  slug: 'not-that-important',
                  title: 'Not That Important',
                  desc: 'A story about nothing important',
                  image: 'nothing.jpg',
                  mediaType: 'audio',
                  tags: ['nothing', 'really'],
                }
              ]
            }
          ]
        };

        mediaProvider.groupedByCategory().pipe(take(1)).subscribe((media: Array<GroupedMedia>) => {
          expect(media).not.toBeNull();
          expect(Object.keys(media).length).toEqual(4);
          const originals = media['originals'];
          expect(originals.media.length).toEqual(2);
          const originalTitles = originals.media.map((orig) => orig.title);
          expect(originalTitles).toEqual(['Newbies Welcome', 'Attack of the Shoe']);
          const newMedia = media['new'];
          expect(newMedia.media.length).toEqual(1);
          const newTitles = newMedia.media.map((nm) => nm.title);
          expect(newTitles).toEqual(['Newbies Welcome']);
          const comedy = media['comedy'];
          expect(comedy.media.length).toEqual(1);
          const comedyTitles = comedy.media.map((com) => com.title);
          expect(comedyTitles).toEqual(['A Sneeze is a Breeze']);
          const other = media['other'];
          expect(other.media.length).toEqual(1);
          const otherTitles = other.media.map((oth) => oth.title);
          expect(otherTitles).toEqual(['Not That Important']);
        });

        const request = app.httpMock.expectOne('assets/content/en/data/main.json');
        request.flush(response);
      })));

    });

    describe('recommended()', () => {
      beforeEach(() => {
          app = new AppTestingModule();
          app.configure([], [MediaProvider], true);
      });

      it('should return the recommended shows', async(inject([MediaProvider], (mediaProvider) => {
        const response = {
          content: [
            {
              itemName: 'test response',
              content: [
                {
                  categories: ['New', 'Originals'],
                  recommended: true,
                  slug: 'the-perfect-beard',
                  title: 'The Perfect Beard',
                  desc: 'Learn how to develop the perfect beard.',
                  image: 'bearded-man.jpg',
                  mediaType: 'video',
                  tags: ['beards', 'how-to', 'specials'],
                },
                {
                  categories: ['Specials'],
                  slug: 'grow-fabulous-hair',
                  title: 'Grow Fabulous Hair',
                  desc: 'A story about Hair Growth',
                  image: 'Hair.jpg',
                  mediaType: 'video',
                  tags: ['long', 'vibrant'],
                },
                {
                  categories: ['Unique'],
                  recommended: true,
                  slug: 'unique-fashion',
                  title: 'Unique Fashion',
                  desc: 'Learn about fashion around the world',
                  image: 'fashion.jpg',
                  mediaType: 'video',
                  tags: ['fashion', 'colors'],
                }
              ]
            }
          ]
        };

        mediaProvider.recommended().pipe(take(1)).subscribe((recommended) => {
          expect(recommended).not.toBeNull();
          expect(recommended.length).toEqual(2);
          const titles = recommended.map((item) => item.title);
          expect(titles).toEqual(['The Perfect Beard', 'Unique Fashion']);
        });
        const request = app.httpMock.expectOne('assets/content/en/data/main.json');
        request.flush(response);
      })));
    });

  });

});

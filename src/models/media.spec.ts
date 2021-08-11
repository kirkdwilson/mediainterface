import {} from 'jasmine';
import { Category } from './category';
import { Media } from './media';

describe('Media', () => {

  describe('imagePath', () => {

    it('should contain the correct values', () => {
      const media = new Media(
        [new Category('Originals'), new Category('Special')],
        'A new original series',
        'special-episode.jpg',
        'video',
        'original-series',
        'Original Series',
        'zh',
        false,
        ['free']
      );
      expect(media.imagePath).toContain('/zh/');
      expect(media.imagePath).toContain('special-episode.jpg');
    });

  });

  describe('categoryList', () => {

    it('should return the list', () => {
      const media = new Media(
        [new Category('Unique'), new Category('specials'), new Category('original')],
        'A unique experience',
        'unique-experience.jpg',
        'video',
        'unique-experience',
        'Unique Experience'
      );
      expect(media.categoryList).toEqual('Original, Specials, Unique');
    });

  });

});

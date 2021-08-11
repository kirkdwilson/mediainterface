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

});

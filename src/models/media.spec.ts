import {} from 'jasmine';
import { Media } from './media';

describe('Media', () => {

  describe('imagePath', () => {

    it('should contain the correct values', () => {
      const media = new Media(
        ['Originals', 'Special'],
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

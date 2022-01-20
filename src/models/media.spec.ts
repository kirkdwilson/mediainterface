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
        'VIDEO',
        'original-series',
        'Original Series',
        '',
        '',
        'zh',
        '',
        false,
        ['free']
      );
      expect(media.imagePath).toContain('/zh/');
      expect(media.imagePath).toContain('special-episode.jpg');
      // It should lowercase it.
      expect(media.mediaType).toContain('video');
    });

  });

  describe('filePath', () => {

    it('should contain the correct values', () => {
      const media = new Media(
        [new Category('Free')],
        'A free show',
        'free-show.jpg',
        'video',
        'really-free',
        'Really Free',
        'really-free.mp4',
        '',
        'ch',
        'video/mp4',
        false,
        ['free']
      );
      expect(media.filePath).toContain('/ch/');
      expect(media.filePath).toContain('really-free.mp4');
    });

    it('should return empty if no file name set', () => {
      const media = new Media(
        [new Category('Great Episodes')],
        'The best episodes around',
        'best-episodes.jpg',
        'video',
        'the-best',
        'The Best',
        '',
        '',
        'ch',
        '',
        false,
        ['free']
      );
      expect(media.filePath).toEqual('');
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

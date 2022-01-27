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

  describe('downloadPath', () =>  {

    it('should return the correct path for standard file', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'A challenging task',
        'challenging-task.jpg',
        'video',
        'challenging-task',
        'Challenging Task',
        'challenging-task.mp4',
        'zh'
      );
      expect(media.downloadPath).toEqual('assets/content/zh/media/challenging-task.mp4');
    });

    it('should return the correct path for html files', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'my dog webpage',
        'my-dog-webpage.jpg',
        'html',
        'my-dog-webpage',
        'My Dog Webpage',
        '',
        'en'
      );
      expect(media.downloadPath).toEqual('assets/content/en/html/my-dog-webpage.zip');
    });

    it('should return the correct path for h5p files', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'cat care',
        'cat-care.jpg',
        'h5p',
        'cat-care',
        'Cat Care',
        '',
        'pt'
      );
      expect(media.downloadPath).toEqual('assets/content/pt/media/cat-care.h5p');
    });

  });

  describe('filePath', () =>  {

    it('should return the correct path for standard file', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'A challenging task',
        'challenging-task.jpg',
        'video',
        'challenging-task',
        'Challenging Task',
        'challenging-task.mp4',
        'zh'
      );
      expect(media.filePath).toContain('/zh/');
      expect(media.filePath).toContain('media/challenging-task.mp4');
    });

    it('should return the correct path for html files', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'my dog webpage',
        'my-dog-webpage.jpg',
        'html',
        'my-dog-webpage',
        'My Dog Webpage',
        '',
        'en'
      );
      expect(media.filePath).toContain('/en/');
      expect(media.filePath).toContain('html/my-dog-webpage');
      expect(media.filePath).not.toContain('.zip');
    });

    it('should return the correct path for h5p files', () => {
      const media = new Media(
        [new Category('specials'), new Category('original')],
        'cat care',
        'cat-care.jpg',
        'h5p',
        'cat-care',
        'Cat Care',
        '',
        'pt'
      );
      expect(media.filePath).toContain('/pt/');
      expect(media.filePath).toContain('media/cat-care');
      expect(media.filePath).not.toContain('.h5p');
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
        'ch',
        '',
        false,
        ['free']
      );
      expect(media.filePath).toEqual('');
    });

  });

});

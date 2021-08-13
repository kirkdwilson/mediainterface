import {} from 'jasmine';
import { Episode } from './episode';

describe('Episode', () => {

  describe('imagePath', () => {

    it('should contain the correct values', () => {
      const episode = new Episode(
        'A show about tuna!',
        'tuna.mp4',
        'tuna.jpg',
        'video',
        'video/mp4',
        1,
        'A Fishy Tale',
        'ch'
      );
      expect(episode.imagePath).toContain('/ch/');
      expect(episode.imagePath).toContain('tuna.jpg');
    });

  });

  describe('filePath', () => {

    it('should contain the correct values', () => {
      const episode = new Episode(
        'A show about boats!',
        'boat.mp4',
        'boat.jpg',
        'video/mp4',
        'video',
        1,
        'A Tuna Boat',
        'zh'
      );
      expect(episode.filePath).toContain('/zh/');
      expect(episode.filePath).toContain('boat.mp4');
    });

  });

});

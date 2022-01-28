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
        'a-tuna-show',
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
        'video',
        'video/mp4',
        'a-boat',
        'A Tuna Boat',
        'zh'
      );
      expect(episode.filePath).toContain('/zh/');
      expect(episode.filePath).toContain('/media/boat.mp4');
    });

    it('should contain the correct values for html', () => {
      const episode = new Episode(
        'A show about cows!',
        '',
        'cow-show.jpg',
        'html',
        'document/html',
        'cow-show',
        'A show about cows and their drama!',
        'es'
      );
      expect(episode.filePath).toContain('/es/');
      expect(episode.filePath).toContain('/html/cow-show');
      expect(episode.filePath).not.toContain('.zip');
    });

    it('should contain the correct values for h5p', () => {
      const episode = new Episode(
        'A show about boomerangs!',
        '',
        'bounce-back.jpg',
        'h5p',
        'document/h5p',
        'bounce-back',
        'Bouncing back for a second season.',
        'fr'
      );
      expect(episode.filePath).toContain('/fr/');
      expect(episode.filePath).toContain('/media/bounce-back');
      expect(episode.filePath).not.toContain('.h5p');
    });

  });

  describe('downloadPath', () =>  {

    it('should return an empty string if missing filename on certain types', () => {
      const episode = new Episode(
        'Barney Rules',
        '',
        'barney-rules.jpg',
        'audio',
        'audio/mp3',
        'barney-rules',
        'Barney Rules',
        'en'
      );
      expect(episode.downloadPath).toEqual('');
    });

    it('should contain the correct values', () => {
      const episode = new Episode(
        'George the Giraffe and Friends',
        'georgie-and-friends.mp3',
        'best-pic.jpg',
        'audio',
        'audio/mp3',
        'georgie-and-friends',
        'George the Giraffe and Friends',
        'en'
      );
      expect(episode.downloadPath).toContain('/en/');
      expect(episode.downloadPath).toContain('/media/georgie-and-friends.mp3');
    });

    it('should contain the correct values for html', () => {
      const episode = new Episode(
        'My hamster home page',
        '',
        'my-hamster.jpg',
        'html',
        'application/html',
        'my-hamster',
        'Jewel is My Hamster',
        'fr'
      );
      expect(episode.downloadPath).toContain('/fr/');
      expect(episode.downloadPath).toContain('/html/my-hamster.zip');
    });

    it('should contain the correct values for h5p', () => {
      const episode = new Episode(
        'Taking care of Skunks',
        '',
        'skunk-stinky.jpg',
        'h5p',
        'application/h5p',
        'skunk-stinky',
        'A Real Stinker of a Class',
        'zh'
      );
      expect(episode.downloadPath).toContain('/zh/');
      expect(episode.downloadPath).toContain('/media/skunk-stinky.h5p');
    });

  });

});

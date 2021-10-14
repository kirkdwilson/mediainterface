import {} from 'jasmine';
import { Category } from './category';

describe('Category', () => {

  describe('hash', () => {

    it('should work with strange characters', () => {
      const category = new Category('神之羔羊系列');
      expect(category.hash).not.toEqual('');
      expect(category.hash).not.toEqual('神之羔羊系列');
      const categoryTwo = new Category('لك');
      expect(categoryTwo.hash).not.toEqual('');
      expect(categoryTwo.hash).not.toEqual('لك');
      expect(categoryTwo.hash).not.toEqual(category.hash);
    });

  });

  describe('sameAs()', () => {

    it('should return true', () => {
      const category = new Category('Favorite Movies');
      expect(category.sameAs('favorite movies')).toBe(true);
    });

    it('should return false', () => {
      const category = new Category('My Place of Joy');
      expect(category.sameAs('freedom')).toBe(false);
    });

  });

});

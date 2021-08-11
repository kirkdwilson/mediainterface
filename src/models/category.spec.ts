import {} from 'jasmine';
import { Category } from './category';

describe('Category', () => {

  describe('slug', () => {

    it('should create the slug on construction', () => {
      const category = new Category('Favorite Movies');
      expect(category.slug).toEqual('favorite-movies');
      const categoryTwo = new Category('Ice Cream and Soda');
      expect(categoryTwo.slug).toEqual('ice-cream-and-soda');
      const categoryThree = new Category('special * % $ twilight');
      expect(categoryThree.slug).toEqual('special-twilight');
    });

  });

});

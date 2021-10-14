import {} from 'jasmine';
import { hashify } from './utilities';

describe('Utilities', () => {

  it('should work with strange characters', () => {
    const hash = hashify('神之羔羊系列');
    expect(hash).not.toEqual('');
    expect(hash).not.toEqual('神之羔羊系列');
    const hashTwo = hashify('لك');
    expect(hashTwo).not.toEqual('');
    expect(hashTwo).not.toEqual('لك');
    expect(hashTwo).not.toEqual(hash);
  });

});

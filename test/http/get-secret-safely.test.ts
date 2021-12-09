import { getSecretSafely } from '../../src/http/get-secret-safely';
import { arbitraryWord } from '../helpers';

describe('get-secret-safely', () => {
  describe('when the input is valid', () => {
    const input = arbitraryWord();

    it('returns the input', () => {
      expect(getSecretSafely(input)).toBe(input);
    });
  });

  describe.skip('when the input is not valid', () => {
    it.each([
      [undefined],
      [''],
    ])('returns a non empty string', (input) => {
      expect(getSecretSafely(input).length).toBeGreaterThanOrEqual(12);
    });
  });
});

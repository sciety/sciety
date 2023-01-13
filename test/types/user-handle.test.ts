import * as E from 'fp-ts/Either';
import * as t from 'io-ts';

const userHandleCodec = t.string;

describe('user-handle', () => {
  describe('permitted handles', () => {
    it.each([
      ['scietyHQ'],
    ])('%s succeeds', (input) => {
      const result = userHandleCodec.decode(input);

      expect(E.isRight(result)).toBe(true);
    });
  });
});

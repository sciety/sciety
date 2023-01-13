import * as E from 'fp-ts/Either';
import * as t from 'io-ts';

const userHandleCodec = t.string;

describe('user-handle', () => {
  describe('permitted handles', () => {
    it.each([
      ['scietyHQ'],
      ['12345'],
      ['sciety_HQ'],
    ])('%s succeeds', (input) => {
      const result = userHandleCodec.decode(input);

      expect(E.isRight(result)).toBe(true);
    });
  });

  describe.skip('forbidden handles', () => {
    it.each([
      [undefined, 'empty value'],
      ['', 'too short'],
      ['/', 'illegal character'],
      ['abc', 'too short'],
      ['a b c', 'spaces not allowed'],
      ['abcdeabcdeabcdex', 'too long'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ])('%s fails [%s]', (input, _) => {
      const result = userHandleCodec.decode(input);

      expect(E.isLeft(result)).toBe(true);
    });
  });
});

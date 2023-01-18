import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { sequenceS } from 'fp-ts/Apply';

describe('either-sequence', () => {
  describe('sequencing two rights', () => {
    const result = pipe(
      {
        a: E.right(41),
        b: E.right(42),
      },
      sequenceS(E.Apply),
    );

    it('produces a right', () => {
      expect(result).toStrictEqual(E.right({
        a: 41,
        b: 42,
      }));
    });
  });
});

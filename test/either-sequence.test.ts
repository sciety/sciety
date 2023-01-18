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

  describe('sequencing a right and a left', () => {
    const result = pipe(
      {
        a: E.right(41),
        b: E.left('b-encountered-an-error' as const),
      },
      sequenceS(E.Apply),
    );

    it('produces a left', () => {
      expect(result).toStrictEqual(E.left('b-encountered-an-error' as const));
    });
  });

  describe('sequencing two lefts', () => {
    const result = pipe(
      {
        a: E.left('a-encountered-an-error' as const),
        b: E.left('b-encountered-an-error' as const),
      },
      sequenceS(E.Apply),
    );

    it('produces a left containing one of the two left values', () => {
      expect(result).toStrictEqual(E.left('a-encountered-an-error' as const));
    });
  });

  describe('sequencing two lefts of different type', () => {
    // does not compile: Type '{ readonly message: "a-encountered-an-error"; readonly payload: 41; }' is not assignable to type '"b-encountered-an-error"'.
    // try E.apW instead?
    //const result = pipe(
    //  {
    //    a: E.left({ message: 'a-encountered-an-error', payload: 41 } as const),
    //    b: E.left('b-encountered-an-error' as const),
    //  },
    //  sequenceS(E.Apply),
    //);

    it('produces a left containing one of the two left values', () => {
      expect(result).toStrictEqual(E.left('a-encountered-an-error' as const));
    });
  });
});

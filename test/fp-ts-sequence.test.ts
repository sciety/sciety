import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

describe('fp-ts-sequence', () => {
  describe('folding', () => {
    it('takes out a Task from inside an Either', async () => {
      const result = pipe(
        E.right(T.of(42)),
        E.foldW(
          (left) => TE.left(left),
          (right) => pipe(
            right,
            T.map((value) => `the number is ${value}`),
            TE.rightTask,
          ),
        ),
      );

      expect(await result()).toStrictEqual(E.right('the number is 42'));
    });
  });

  describe('.sequence', () => {
    it('takes out a Task from inside a ReadonlyArray', async () => {
      const result = pipe(
        [T.of(42)],
        RA.sequence(T.ApplicativeSeq),
        T.map(RA.map((value) => `the number is ${value}`)),
      );

      expect(await result()).toStrictEqual(['the number is 42']);
    });

    it('takes out a Task from inside an Either', async () => {
      const result = pipe(
        E.right(T.of(42)),
        E.sequence(T.ApplicativeSeq),
        TE.map((value) => `the number is ${value}`),
      );

      expect(await result()).toStrictEqual(E.right('the number is 42'));
    });
  });
});

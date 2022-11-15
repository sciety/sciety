/* eslint-disable jest/prefer-lowercase-title */
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

describe('fp-ts-sequence', () => {
  describe('folding aka reducing', () => {
    it('takes out a Task from inside a ReadonlyArray', async () => {
      const result = pipe(
        [T.of(42), T.of(43)],
        RA.reduce(
          T.of<ReadonlyArray<number>>([]),
          (accumulator, task) => pipe(
            accumulator,
            T.chain((acc) => pipe(
              task,
              T.map((taskValue) => [...acc, taskValue]),
            )),
          ),
        ),
      );

      expect(await result()).toStrictEqual([42, 43]);
    });

    it('takes out a Task from inside an Either', async () => {
      const result = pipe(
        E.right(T.of(42)),
        E.foldW(
          TE.left,
          TE.rightTask,
        ),
      );

      expect(await result()).toStrictEqual(E.right(42));
    });
  });

  describe('.sequence', () => {
    it('takes out a Task from inside a ReadonlyArray', async () => {
      const result = pipe(
        [T.of(42)],
        RA.sequence(T.ApplicativeSeq),
      );

      expect(await result()).toStrictEqual([42]);
    });

    it('takes out a Task from inside an Either', async () => {
      const result = pipe(
        E.right(T.of(42)),
        E.sequence(T.ApplicativeSeq),
      );

      expect(await result()).toStrictEqual(E.right(42));
    });
  });

  describe('T.sequenceArray', () => {
    it('takes out a Task from inside a ReadonlyArray', async () => {
      const result = pipe(
        [T.of(42)],
        T.sequenceArray,
      );

      expect(await result()).toStrictEqual([42]);
    });
  });
});

import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { Task } from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import pmap from 'p-map';

export function parallel<A>(tasks: ReadonlyArray<Task<A>>, limit: number): Task<ReadonlyArray<A>> {
  return async () => pmap(tasks, async (t) => t(), { concurrency: limit });
}

type TaskEitherWithIndex = <A, B, E>(f: (index: number, a: A)
=> TE.TaskEither<E, B>, limit: number)
=> (input: ReadonlyArray<A>,) => TE.TaskEither<E, ReadonlyArray<B>>;

export const taskEitherWithIndex: TaskEitherWithIndex = (func, limit) => (input) => pipe(
  input,
  RA.mapWithIndex(func),
  (arrayOfTaskEithers) => parallel(arrayOfTaskEithers, limit),
  T.map(E.sequenceArray),
);

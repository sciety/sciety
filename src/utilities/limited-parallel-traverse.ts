import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import pmap from 'p-map';

type Task = <A>(limit: number)
=> (tasks: ReadonlyArray<T.Task<A>>)
=> T.Task<ReadonlyArray<A>>;

export const task: Task = (limit) => (tasks) => async () => pmap(tasks, async (t) => t(), { concurrency: limit });

type TaskWithIndex = <A, B>(f: (index: number, a: A)
=> T.Task<B>, limit: number)
=> (input: ReadonlyArray<A>,) => T.Task<ReadonlyArray<B>>;

export const taskWithIndex: TaskWithIndex = (func, limit) => (input) => pipe(
  input,
  RA.mapWithIndex(func),
  task(limit),
);

type TaskEither = <A, B, E>(f: (a: A)
=> TE.TaskEither<E, B>, limit: number)
=> (input: ReadonlyArray<A>,) => TE.TaskEither<E, ReadonlyArray<B>>;

export const taskEither: TaskEither = (func, limit) => (input) => pipe(
  input,
  RA.map(func),
  task(limit),
  T.map(E.sequenceArray),
);

type TaskEitherWithIndex = <A, B, E>(f: (index: number, a: A)
=> TE.TaskEither<E, B>, limit: number)
=> (input: ReadonlyArray<A>,) => TE.TaskEither<E, ReadonlyArray<B>>;

export const taskEitherWithIndex: TaskEitherWithIndex = (func, limit) => (input) => pipe(
  input,
  RA.mapWithIndex(func),
  task(limit),
  T.map(E.sequenceArray),
);

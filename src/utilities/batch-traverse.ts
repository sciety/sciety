import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import pmap from 'p-map';

type BatchApplyTask = <A>(batchSize: number)
=> (tasks: ReadonlyArray<T.Task<A>>)
=> T.Task<ReadonlyArray<A>>;

export const batchApplyTask: BatchApplyTask = (
  batchSize,
) => (
  tasks,
) => async () => pmap(tasks, async (t) => t(), { concurrency: batchSize });

type BatchTaskTraverseWithIndex = <A, B>(f: (index: number, a: A)
=> T.Task<B>, limit: number)
=> (input: ReadonlyArray<A>,) => T.Task<ReadonlyArray<B>>;

export const batchTaskTraverseWithIndex: BatchTaskTraverseWithIndex = (func, batchSize) => (input) => pipe(
  input,
  RA.mapWithIndex(func),
  batchApplyTask(batchSize),
);

type BatchTaskEitherTraverse = <A, B, E>(f: (a: A)
=> TE.TaskEither<E, B>, limit: number)
=> (input: ReadonlyArray<A>,) => TE.TaskEither<E, ReadonlyArray<B>>;

export const batchTaskEitherTraverse: BatchTaskEitherTraverse = (func, limit) => (input) => pipe(
  input,
  RA.map(func),
  batchApplyTask(limit),
  T.map(E.sequenceArray),
);

type BatchTaskEitherTraverseWithIndex = <A, B, E>(f: (index: number, a: A)
=> TE.TaskEither<E, B>, limit: number)
=> (input: ReadonlyArray<A>,) => TE.TaskEither<E, ReadonlyArray<B>>;

export const batchTaskEitherTraverseWithIndex: BatchTaskEitherTraverseWithIndex = (func, limit) => (input) => pipe(
  input,
  RA.mapWithIndex(func),
  batchApplyTask(limit),
  T.map(E.sequenceArray),
);

import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import pmap from 'p-map';

type BatchApplyTask = <A>(batchSize: number)
=> (tasks: ReadonlyArray<T.Task<A>>)
=> T.Task<ReadonlyArray<A>>;

const batchApplyTask: BatchApplyTask = (
  batchSize,
) => (
  tasks,
) => async () => pmap(tasks, async (t) => t(), { concurrency: batchSize });

type BatchTaskTraverse = <A, B>(f: (a: A)
=> T.Task<B>, limit: number)
=> (input: ReadonlyArray<A>,) => T.Task<ReadonlyArray<B>>;

export const batchTaskTraverse: BatchTaskTraverse = (func, batchSize) => (input) => pipe(
  input,
  RA.map(func),
  batchApplyTask(batchSize),
);

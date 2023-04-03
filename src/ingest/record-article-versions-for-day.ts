import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

export const recordAll = (): TE.TaskEither<unknown, unknown> => pipe(
  undefined,
  TE.right,
);

void (async (): Promise<unknown> => pipe(
  recordAll(),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();

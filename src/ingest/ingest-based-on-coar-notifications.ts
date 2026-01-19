import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

const processNotifications = () => {
  // eslint-disable-next-line no-console
  console.log('To be implemented');
  return TE.right(undefined);
};

void (async (): Promise<unknown> => pipe(
  processNotifications(),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();

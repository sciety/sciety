import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';

const replayEventsForPolicy = () => T.of(undefined);

void (async (): Promise<void> => pipe(
  replayEventsForPolicy(),
  T.chainFirst(() => T.of(process.stdout.write('Completed\n'))),
)())();

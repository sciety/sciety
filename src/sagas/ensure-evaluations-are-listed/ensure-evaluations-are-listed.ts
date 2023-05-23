import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../shared-read-models';
import { Logger } from '../../shared-ports';

type Ports = Queries & {
  logger: Logger,
};

export const ensureEvaluationsAreListed = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'ensureEvaluationsAreListed starting');
  await pipe(
    [],
    T.of,
  )();
  adapters.logger('info', 'ensureEvaluationsAreListed finished');
};

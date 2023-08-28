import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../shared-read-models';
import { Logger } from '../../shared-ports';

type Dependencies = Queries & {
  logger: Logger,
};

export const ensureEvaluationsAreListed = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'ensureEvaluationsAreListed starting');
  await pipe(
    [],
    T.of,
  )();
  dependencies.logger('info', 'ensureEvaluationsAreListed finished');
};

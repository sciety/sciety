import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as EL from '../../types/evaluation-locator';
import { Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';

type Dependencies = Queries & {
  logger: Logger,
};

export const discoverHypothesisEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverHypothesisEvaluationType starting');
  const first = pipe(
    dependencies.getEvaluationsWithNoType(),
    RA.filter((recordedEvaluation) => EL.service(recordedEvaluation.evaluationLocator) === 'hypothesis'),
    RA.head,
  );
  dependencies.logger('info', 'discoverHypothesisEvaluationType finished', { first });
};

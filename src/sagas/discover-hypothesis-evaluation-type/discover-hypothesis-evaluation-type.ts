import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EL from '../../types/evaluation-locator';
import { FetchReview, Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';

type Dependencies = Queries & {
  fetchReview: FetchReview,
  logger: Logger,
};

export const discoverHypothesisEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverHypothesisEvaluationType starting');
  const first = await pipe(
    dependencies.getEvaluationsWithNoType(),
    RA.filter((recordedEvaluation) => EL.service(recordedEvaluation.evaluationLocator) === 'hypothesis'),
    RA.head,
    TE.fromOption(() => 'Nothing to do'),
    TE.chainW((evaluation) => dependencies.fetchReview(evaluation.evaluationLocator)),
  )();
  dependencies.logger('info', 'discoverHypothesisEvaluationType finished', { first });
};

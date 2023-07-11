import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EL from '../../types/evaluation-locator';
import { FetchReview, Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';
import { mapTagToType } from '../../ingest/convert-hypothesis-annotation-to-evaluation';
import { tagToEvaluationTypeMap } from '../../ingest/tag-to-evaluation-type-map';
import { UpdateEvaluation } from '../../shared-ports/update-evaluation';
import { DataError } from '../../types/data-error';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type Dependencies = Queries & {
  fetchReview: FetchReview,
  updateEvaluation: UpdateEvaluation,
  logger: Logger,
};

const mustBeFromHypothesis = (recordedEvaluation: RecordedEvaluation) => (
  EL.service(recordedEvaluation.evaluationLocator) === 'hypothesis'
);

const updateEvaluationIfPossible = (
  dependencies: Dependencies,
) => (evaluationLocator: EvaluationLocator): TE.TaskEither<DataError, unknown> => pipe(
  evaluationLocator,
  dependencies.fetchReview,
  TE.map((fetchedEvaluation) => ({
    evaluationLocator,
    evaluationType: mapTagToType(fetchedEvaluation.tags, tagToEvaluationTypeMap),
  })),
);

export const discoverHypothesisEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverHypothesisEvaluationType starting');
  const first = await pipe(
    dependencies.getEvaluationsWithNoType(),
    RA.filter(mustBeFromHypothesis),
    RA.head,
    TE.fromOption(() => 'Nothing to do'),
    TE.map((evaluation) => evaluation.evaluationLocator),
    TE.chainW(updateEvaluationIfPossible(dependencies)),
  )();
  dependencies.logger('info', 'discoverHypothesisEvaluationType finished', { first });
};

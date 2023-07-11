import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EL from '../../types/evaluation-locator';
import {
  CommitEvents, FetchReview, GetAllEvents, Logger,
} from '../../shared-ports';
import { Queries } from '../../shared-read-models';
import { mapTagToType } from '../../ingest/convert-hypothesis-annotation-to-evaluation';
import { tagToEvaluationTypeMap } from '../../ingest/tag-to-evaluation-type-map';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { executeCommand } from '../../write-side/commands/execute-command';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';
import { updateEvaluationCommandCodec } from '../../write-side/commands';
import { update } from '../../write-side/resources/evaluation';

type Dependencies = Queries & {
  fetchReview: FetchReview,
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  logger: Logger,
};

const mustBeFromHypothesis = (recordedEvaluation: RecordedEvaluation) => (
  EL.service(recordedEvaluation.evaluationLocator) === 'hypothesis'
);

const updateEvaluationIfPossible = (
  dependencies: Dependencies,
) => (evaluationLocator: EvaluationLocator): TE.TaskEither<ErrorMessage, unknown> => pipe(
  evaluationLocator,
  dependencies.fetchReview,
  TE.bimap(
    (de) => toErrorMessage(de),
    (fetchedEvaluation) => ({
      evaluationLocator,
      evaluationType: mapTagToType(fetchedEvaluation.tags, tagToEvaluationTypeMap),
    }),
  ),
  TE.chain(executeCommand(dependencies, updateEvaluationCommandCodec, update)),
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

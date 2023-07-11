import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as EL from '../../types/evaluation-locator';
import {
  CommitEvents, FetchReview, GetAllEvents, Logger,
} from '../../shared-ports';
import { Queries } from '../../shared-read-models';
import { mapTagToType } from '../../ingest/convert-hypothesis-annotation-to-evaluation';
import { tagToEvaluationTypeMap } from '../../ingest/tag-to-evaluation-type-map';
import { UpdateEvaluation } from '../../shared-ports/update-evaluation';
import { EvaluationLocator, evaluationLocatorCodec } from '../../types/evaluation-locator';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { executeCommand } from '../../write-side/commands/execute-command';
import { ResourceAction } from '../../write-side/resources/resource-action';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';

const evaluationTypeCodec = t.union([t.literal('review'), t.literal('author-response'), t.literal('curation-statement')]);

const updateEvaluationCommandCodec = t.strict({
  evaluationLocator: evaluationLocatorCodec,
  evaluationType: evaluationTypeCodec,
});

type UpdateEvaluationCommand = t.TypeOf<typeof updateEvaluationCommandCodec>;

type Dependencies = Queries & {
  fetchReview: FetchReview,
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  updateEvaluation: UpdateEvaluation,
  logger: Logger,
};

const mustBeFromHypothesis = (recordedEvaluation: RecordedEvaluation) => (
  EL.service(recordedEvaluation.evaluationLocator) === 'hypothesis'
);

const update: ResourceAction<UpdateEvaluationCommand> = () => () => E.right([]);

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

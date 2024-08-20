import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4, v4 } from 'uuid';
import * as paths from '../../read-side/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type RecordedEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

const hardcodedRecordedEvaluations = [
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.13274625'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.12958884'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.05.07.592993'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.11644732'),
  },
] satisfies ReadonlyArray<RecordedEvaluation>;

const constructCoarNotificationModel = (
  recordedEvaluation: RecordedEvaluation,
): CoarNotificationModel => ({
  id: `urn:uuid:${v4()}`,
  objectId: new URL(`https://sciety.org${paths.constructPaperActivityPageFocusedOnEvaluationHref(recordedEvaluation.expressionDoi, recordedEvaluation.evaluationLocator)}`),
  contextId: new URL(`https://sciety.org${paths.constructPaperActivityPageHref(recordedEvaluation.expressionDoi)}`),
  contextCiteAs: new URL(`https://doi.org/${recordedEvaluation.expressionDoi}`),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
});

type Dependencies = DependenciesForSagas;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    hardcodedRecordedEvaluations,
    RA.map(constructCoarNotificationModel),
    TE.traverseArray(dependencies.sendCoarNotification),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

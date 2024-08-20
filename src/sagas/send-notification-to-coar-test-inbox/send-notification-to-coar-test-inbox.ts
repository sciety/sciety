import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import * as paths from '../../read-side/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type RecordedEvaluation = {
  id: string,
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

const hardcodedRecordedEvaluations = [
  {
    id: 'urn:uuid:94ecae35-dcfd-4182-8550-22c7164fe23f',
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.13274625'),
  },
  {
    id: 'urn:uuid:bcebd78d-a869-4d4c-aaa5-eef703e9e583',
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.12958884'),
  },
  {
    id: 'urn:uuid:13ecd429-3611-4842-ad44-140195444152',
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.05.07.592993'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.11644732'),
  },
] satisfies ReadonlyArray<RecordedEvaluation>;

const constructCoarNotificationModel = (
  recordedEvaluation: RecordedEvaluation,
): CoarNotificationModel => ({
  ...recordedEvaluation,
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

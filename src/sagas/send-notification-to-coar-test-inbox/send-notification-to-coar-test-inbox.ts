import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4, v4 } from 'uuid';
import { getRecordedEvaluationsForExternalNotifications, RecordedEvaluation } from './get-recorded-evaluations-for-external-notifications';
import * as paths from '../../read-side/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { DependenciesForSagas } from '../dependencies-for-sagas';

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
    getRecordedEvaluationsForExternalNotifications,
    RA.map(constructCoarNotificationModel),
    TE.traverseArray(dependencies.sendCoarNotification),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

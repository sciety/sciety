import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { constructCoarNotificationModel } from './construct-coar-notification-model';
import { getPendingEvaluations } from '../../read-models/evaluations-for-notifications/get-pending-evaluations';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type Dependencies = DependenciesForSagas;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
  scietyUiOrigin: URL,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    getPendingEvaluations(),
    RA.map(constructCoarNotificationModel(scietyUiOrigin)),
    TE.traverseArray(dependencies.sendCoarNotification),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

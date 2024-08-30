import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { constructCoarNotificationModel } from './construct-coar-notification-model';
import * as coarNotification from '../../write-side/resources/coar-notification';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type Dependencies = DependenciesForSagas;

export const sendNotificationsToCoarInboxes = async (
  dependencies: Dependencies,
  scietyUiOrigin: URL,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationsToCoarInboxes starting', { iterationId });
  await pipe(
    dependencies.getPendingNotifications(),
    RA.head,
    TE.fromOption(() => 'no pending notifications'),
    TE.chainW((pendingNotification) => pipe(
      pendingNotification,
      TE.right,
      TE.tap(() => pipe(
        pendingNotification,
        constructCoarNotificationModel(scietyUiOrigin),
        dependencies.sendCoarNotification,
      )),
      TE.chainW(executeResourceAction(dependencies, coarNotification.recordDelivery)),
      TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationsToCoarInboxes failed', { iterationId }))),
    )),
  )();
  dependencies.logger('debug', 'sendNotificationsToCoarInboxes finished', { iterationId });
};

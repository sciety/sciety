import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { constructCoarNotificationModel } from './construct-coar-notification-model';
import * as coarNotification from '../../write-side/resources/coar-notification';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import { DependenciesForSagas } from '../dependencies-for-sagas';
import { Saga } from '../saga';

type Dependencies = DependenciesForSagas;

export const ensureDeliveryOfNotificationsToCoarInboxes = (
  dependencies: Dependencies,
  scietyUiOrigin: URL,
): Saga => async () => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationsToCoarInboxes starting', { iterationId });
  await pipe(
    dependencies.getPendingNotifications(),
    RA.head,
    TE.fromOption(() => 'no pending notifications' as const),
    TE.tap((pendingNotification) => pipe(
      pendingNotification,
      constructCoarNotificationModel(scietyUiOrigin),
      dependencies.sendCoarNotification,
    )),
    TE.flatMap((pendingNotification) => pipe(
      {
        evaluationLocator: pendingNotification.evaluationLocator,
        targetId: pendingNotification.target.id,
      },
      executeResourceAction(dependencies, coarNotification.markAsDelivered),
    )),
    TE.tapError((left) => (
      left === 'no pending notifications'
        ? TE.right(undefined)
        : TE.right(dependencies.logger('error', 'sendNotificationsToCoarInboxes failed', { iterationId, left })))),
  )();
  dependencies.logger('debug', 'sendNotificationsToCoarInboxes finished', { iterationId });
};

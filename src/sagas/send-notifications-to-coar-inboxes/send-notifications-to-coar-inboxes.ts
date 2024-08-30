import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { constructCoarNotificationModel } from './construct-coar-notification-model';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type Dependencies = DependenciesForSagas;

export const sendNotificationsToCoarInboxes = async (
  dependencies: Dependencies,
  scietyUiOrigin: URL,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationsToCoarInboxes starting', { iterationId });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const issueCommand = (coarNotificationModel: CoarNotificationModel) => 'not-implemented-yet';
  await pipe(
    dependencies.getPendingNotifications(),
    RA.head,
    TE.fromOption(() => 'no pending notifications'),
    TE.map(constructCoarNotificationModel(scietyUiOrigin)),
    TE.chainW((coarNotificationModel) => pipe(
      coarNotificationModel,
      TE.right,
      TE.tap(dependencies.sendCoarNotification),
      TE.map(issueCommand),
      TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationsToCoarInboxes failed', { iterationId }))),
    )),
  )();
  dependencies.logger('debug', 'sendNotificationsToCoarInboxes finished', { iterationId });
};

import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { DependenciesForSagas } from '../dependencies-for-sagas';

const hardcodedCoarNotificationModel1: CoarNotificationModel = {
  id: 'urn:uuid:94ecae35-dcfd-4182-8550-22c7164fe23f',
  objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.13274625'),
  contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276'),
  contextCiteAs: new URL('https://doi.org/10.1101/2024.04.03.24305276'),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
};

const hardcodedCoarNotificationModel2: CoarNotificationModel = {
  id: 'urn:uuid:bcebd78d-a869-4d4c-aaa5-eef703e9e583',
  objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.13274625'),
  contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276'),
  contextCiteAs: new URL('https://doi.org/10.1101/2024.04.03.24305276'),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
};

type Dependencies = DependenciesForSagas;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    hardcodedCoarNotificationModel1,
    dependencies.sendCoarNotification,
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  await pipe(
    hardcodedCoarNotificationModel2,
    dependencies.sendCoarNotification,
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { DependenciesForSagas } from '../dependencies-for-sagas';

const hardcodedCoarNotificationModels = [
  {
    id: 'urn:uuid:94ecae35-dcfd-4182-8550-22c7164fe23f',
    objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.13274625'),
    contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276'),
    contextCiteAs: new URL('https://doi.org/10.1101/2024.04.03.24305276'),
    targetId: new URL('https://coar-notify-inbox.fly.dev'),
    targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
  },
  {
    id: 'urn:uuid:bcebd78d-a869-4d4c-aaa5-eef703e9e583',
    objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.12958884'),
    contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276'),
    contextCiteAs: new URL('https://doi.org/10.1101/2024.04.03.24305276'),
    targetId: new URL('https://coar-notify-inbox.fly.dev'),
    targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
  },
  {
    id: 'urn:uuid:13ecd429-3611-4842-ad44-140195444152',
    objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.05.07.592993#doi:10.5281/zenodo.11644732'),
    contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.05.07.592993'),
    contextCiteAs: new URL('https://doi.org/10.1101/2024.05.07.592993'),
    targetId: new URL('https://coar-notify-inbox.fly.dev'),
    targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
  },
];

type Dependencies = DependenciesForSagas;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    hardcodedCoarNotificationModels,
    TE.traverseArray(dependencies.sendCoarNotification),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { postData } from './post-data';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { DependenciesForCommands } from '../../write-side';

const hardcodedCoarNotificationModel: CoarNotificationModel = {
  id: 'urn:uuid:94ecae35-dcfd-4182-8550-22c7164fe23f',
  objectId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.13274625'),
  contextId: new URL('https://sciety.org/articles/activity/10.1101/2024.04.03.24305276'),
  contextCiteAs: new URL('https://doi.org/10.1101/2024.04.03.24305276'),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
};

type CoarNotificationModel = {
  id: string,
  objectId: URL,
  contextId: URL,
  contextCiteAs: URL,
  targetId: URL,
  targetInbox: URL,
};

const renderCoarNotification = (notification: CoarNotificationModel) => ({
  '@context': [
    'https://www.w3.org/ns/activitystreams',
    'https://purl.org/coar/notify',
  ],
  actor: {
    id: 'https://sciety.org',
    name: 'Sciety',
    type: 'Organization',
  },
  id: notification.id,
  object: {
    id: notification.objectId.toString(),
    type: 'sorg:WebPage',
  },
  context: {
    id: notification.contextId.toString(),
    'ietf:cite-as': notification.contextCiteAs.toString(),
    type: 'sorg:ScholarlyArticle',
  },
  origin: {
    id: 'https://sciety.org',
    inbox: 'https://sciety.org/inbox/',
    type: 'Service',
  },
  target: {
    id: notification.targetId.toString(),
    inbox: notification.targetInbox.toString(),
    type: 'Service',
  },
  type: [
    'Announce',
    'coar-notify:IngestAction',
  ],
});

type Dependencies = DependenciesForViews & DependenciesForCommands;

const sendCoarNotification = (dependencies: Dependencies) => (
  coarNotificationModel: CoarNotificationModel,
): TE.TaskEither<void, void> => {
  const inboxUrl = coarNotificationModel.targetInbox.toString();
  return pipe(
    coarNotificationModel,
    renderCoarNotification,
    postData(inboxUrl, dependencies),
    TE.map(() => undefined),
  );
};

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    hardcodedCoarNotificationModel,
    sendCoarNotification(dependencies),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

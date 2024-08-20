import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { postData } from './post-data';
import { Logger } from '../../logger';
import { CoarNotificationModel } from '../../types/coar-notification-model';

type CoarNotification = {
  '@context': ReadonlyArray<string>,
  actor: {
    id: string,
    name: string,
    type: string,
  },
  id: string,
  object: {
    id: string,
    type: string,
  },
  context: {
    id: string,
    'ietf:cite-as': string,
    type: string,
  },
  origin: {
    id: string,
    inbox: string,
    type: string,
  },
  target: {
    id: string,
    inbox: string,
    type: string,
  },
  type: ReadonlyArray<string>,
};

const renderCoarNotification = (notification: CoarNotificationModel): CoarNotification => ({
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

export const sendCoarNotification = (logger: Logger) => (
  coarNotificationModel: CoarNotificationModel,
): TE.TaskEither<void, void> => {
  const inboxUrl = coarNotificationModel.targetInbox.toString();
  return pipe(
    coarNotificationModel,
    renderCoarNotification,
    postData(logger, inboxUrl),
    TE.map(() => undefined),
  );
};

import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CoarNotificationModel } from './coar-notification-model';
import { postData } from './post-data';
import { Logger } from '../../logger';

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

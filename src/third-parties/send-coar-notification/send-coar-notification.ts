import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { postData } from './post-data';
import { Logger } from '../../logger';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { ErrorMessage } from '../../types/error-message';

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
    id: notification.objectId.href,
    type: 'sorg:WebPage',
  },
  context: {
    id: notification.contextId.href,
    'ietf:cite-as': notification.contextCiteAs.href,
    type: 'sorg:ScholarlyArticle',
  },
  origin: {
    id: 'https://sciety.org',
    inbox: 'https://sciety.org/inbox/',
    type: 'Service',
  },
  target: {
    id: notification.targetId,
    inbox: notification.targetInbox.href,
    type: 'Service',
  },
  type: [
    'Announce',
    'coar-notify:IngestAction',
  ],
});

export type SendCoarNotification = (coarNotificationModel: CoarNotificationModel) => TE.TaskEither<ErrorMessage, void>;

export const sendCoarNotification = (logger: Logger): SendCoarNotification => (coarNotificationModel) => {
  const inboxUrl = coarNotificationModel.targetInbox.href;
  return pipe(
    coarNotificationModel,
    renderCoarNotification,
    postData(logger, inboxUrl),
    TE.map(() => undefined),
  );
};

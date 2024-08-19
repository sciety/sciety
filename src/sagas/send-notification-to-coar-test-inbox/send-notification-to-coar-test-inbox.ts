import { URL } from 'url';
import axios from 'axios';
import { Json } from 'fp-ts/Json';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe, identity } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { constructHeadersWithUserAgent } from '../../third-parties/construct-headers-with-user-agent';
import { logResponseTime } from '../../third-parties/log-response-time';
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

const postData = (url: string, dependencies: Dependencies) => (data: Json) => {
  const startTime = new Date();
  return pipe(
    TE.tryCatch(
      async () => axios.post(url, data, {
        headers: constructHeadersWithUserAgent({
          'Content-Type': 'application/json',
        }),
        timeout: 30 * 1000,
      }),
      identity,
    ),
    T.tap((result) => T.of(logResponseTime(dependencies.logger, startTime, result, url))),
    TE.mapLeft((error) => dependencies.logger('error', 'POST request failed', { error })),
  );
};

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();
  const url = 'https://coar-notify-inbox.fly.dev/inbox/';

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await pipe(
    hardcodedCoarNotificationModel,
    renderCoarNotification,
    postData(url, dependencies),
    TE.tapError(() => TE.right(dependencies.logger('error', 'sendNotificationToCoarTestInbox failed', { iterationId }))),
  )();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};

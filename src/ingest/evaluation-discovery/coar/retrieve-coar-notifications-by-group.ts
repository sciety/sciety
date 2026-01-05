import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const coarInboxResponseCodec = t.strict({
  contains: t.array(t.string),
});

const notificationCodec = t.strict({
  id: t.string,
  type: t.array(t.string),
  origin: t.strict({
    id: t.string,
  }),
  object: t.strict({
    id: t.string,
  }),
});

type Notification = t.TypeOf<typeof notificationCodec>;

export type NotificationDetails = {
  notificationId: string,
  announcementActionUri: string,
};

const isRelevantGroup = (
  groupIdentification: string,
) => (
  notification: Notification,
) => notification.origin.id === groupIdentification;

export const retrieveCoarNotificationsByGroup = (dependencies: Dependencies) => (
  groupIdentification: string,
): TE.TaskEither<string, ReadonlyArray<NotificationDetails>> => {
  pipe(
    'https://inbox-sciety-prod.elifesciences.org/inbox/',
    dependencies.fetchData,
    TE.chainEitherK(decodeAndReportFailures(coarInboxResponseCodec)),
    TE.map((response) => response.contains),
    TE.map(RA.map((knownBrokenUrl) => knownBrokenUrl.replace('inboxurn', 'inbox/urn'))),
    TE.flatMap(TE.traverseArray((notificationUrl) => pipe(
      notificationUrl,
      dependencies.fetchData,
      TE.chainEitherK(decodeAndReportFailures(notificationCodec)),
    ))),
    TE.map(RA.filter(isRelevantGroup(groupIdentification))),
    TE.map(RA.map((relevantNotification) => ({
      notificationId: relevantNotification.id,
      announcementActionUri: relevantNotification.object.id,
    }))),
  );

  if (groupIdentification === 'https://evolbiol.peercommunityin.org/coar_notify/') {
    return TE.right([
      {
        notificationId: 'urn:uuid:0964db9c-c988-4185-891e-0c8a5c79adb9',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: 'https://evolbiol.peercommunityin.org/articles/rec?id=874#review-3751',
        originId: 'https://evolbiol.peercommunityin.org/coar_notify/',
      },
      {
        notificationId: 'urn:uuid:13add01f-61b3-4df5-bc7f-ad4ad9fe64f8',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: 'https://evolbiol.peercommunityin.org/articles/rec?id=874#review-3633',
        originId: 'https://evolbiol.peercommunityin.org/coar_notify/',
      },
    ]);
  }
  if (groupIdentification === 'https://neuro.peercommunityin.org/coar_notify/') {
    return TE.right([
      {
        notificationId: 'urn:uuid:6d59e586-5c75-417c-ae15-6abdd8030539',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: 'https://neuro.peercommunityin.org/articles/rec?id=227',
        originId: 'https://neuro.peercommunityin.org/coar_notify/',
      },
      {
        notificationId: 'urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: 'https://neuro.peercommunityin.org/articles/rec?id=217#review-549',
        originId: 'https://neuro.peercommunityin.org/coar_notify/',
      },
    ]);
  }
  return TE.right([]);
};

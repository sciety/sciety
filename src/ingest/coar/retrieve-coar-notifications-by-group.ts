import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../discover-published-evaluations';
import { decodeAndReportFailures } from '../legacy/evaluation-discovery/decode-and-report-failures';

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
): TE.TaskEither<string, ReadonlyArray<NotificationDetails>> => pipe(
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

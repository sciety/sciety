import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Dependencies } from '../../discover-published-evaluations';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const coarInboxResponseCodec = t.strict({
  contains: t.array(t.string),
});

type NotificationTypeBrand = {
  readonly NotificationType: unique symbol,
};

const notificationTypeCodec = t.brand(
  t.array(t.union([t.literal('Announce'), t.literal('coar-notify:ReviewAction')])),
  (input): input is t.Branded<Array<'Announce' | 'coar-notify:ReviewAction'>, NotificationTypeBrand> => input.length === 2 && input[0] === 'Announce' && input[1] === 'coar-notify:ReviewAction',
  'NotificationType',
);

const notificationCodec = t.strict({
  id: t.string,
  type: notificationTypeCodec,
  origin: t.strict({
    id: t.union([
      t.literal('https://evolbiol.peercommunityin.org/coar_notify/'),
      t.literal('https://neuro.peercommunityin.org/coar_notify/'),
    ]),
  }),
  object: t.strict({
    id: t.string,
  }),
});

export type NotificationDetails = {
  notificationId: string,
  notificationType: string,
  announcementActionUri: string,
  originId: string,
};

export const retrieveCoarNotificationsByGroup = (dependencies: Dependencies) => (
  groupIdentification: string,
): TE.TaskEither<string, ReadonlyArray<NotificationDetails>> => {
  pipe(
    'https://inbox-sciety-prod.elifesciences.org/inbox/',
    dependencies.fetchData,
    TE.chainEitherK(decodeAndReportFailures(coarInboxResponseCodec)),
    TE.map((response) => response.contains),
    TE.map(RA.map((knownBrokenUrl) => knownBrokenUrl.replace('inboxurn', 'inbox/urn'))),
    TE.map(RA.map((notificationUrl) => pipe(
      notificationUrl,
      dependencies.fetchData,
      TE.chainEitherK(decodeAndReportFailures(notificationCodec)),
    ))),
  );

  if (groupIdentification === 'https://evolbiol.peercommunityin.org/coar_notify/') {
    return TE.right([
      {
        notificationId: 'urn:uuid:0964db9c-c988-4185-891e-0c8a5c79adb9',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: '',
        originId: 'https://evolbiol.peercommunityin.org/coar_notify/',
      },
      {
        notificationId: 'urn:uuid:13add01f-61b3-4df5-bc7f-ad4ad9fe64f8',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: '',
        originId: 'https://evolbiol.peercommunityin.org/coar_notify/',
      },
    ]);
  }
  if (groupIdentification === 'https://neuro.peercommunityin.org/coar_notify/') {
    return TE.right([
      {
        notificationId: 'urn:uuid:6d59e586-5c75-417c-ae15-6abdd8030539',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: '',
        originId: 'https://neuro.peercommunityin.org/coar_notify/',
      },
      {
        notificationId: 'urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
        notificationType: 'coar-notify:ReviewAction',
        announcementActionUri: '',
        originId: 'https://neuro.peercommunityin.org/coar_notify/',
      },
    ]);
  }
  return TE.right([]);
};

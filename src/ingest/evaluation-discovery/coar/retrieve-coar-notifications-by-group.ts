import * as TE from 'fp-ts/TaskEither';
import { Dependencies } from '../../discover-published-evaluations';

export type NotificationDetails = {
  notificationId: string,
  notificationType: string,
  announcementActionUri: string,
  originId: string,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retrieveCoarNotificationsByGroup = (dependencies: Dependencies) => (
  groupIdentification: string,
): TE.TaskEither<string, ReadonlyArray<NotificationDetails>> => {
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

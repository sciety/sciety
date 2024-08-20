import { URL } from 'url';

export type CoarNotificationModel = {
  id: string,
  objectId: URL,
  contextId: URL,
  contextCiteAs: URL,
  targetId: URL,
  targetInbox: URL,
};

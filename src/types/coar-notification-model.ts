import { URL } from 'url';

export type CoarNotificationModel = {
  id: string,
  objectId: URL,
  contextId: URL,
  contextCiteAs: URL,
  targetId: string,
  targetInbox: URL,
};

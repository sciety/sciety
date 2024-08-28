import { PendingNotification, ReadModel } from './handle-event';

export const getPendingNotifications = (
  readModel: ReadModel,
) => (): ReadonlyArray<PendingNotification> => Array.from(readModel.values()).flat();

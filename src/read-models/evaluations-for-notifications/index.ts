import { coarNotificationsConfig } from './coar-notifications-config';
import { getPendingNotifications } from './get-pending-notifications';
import { handleEvent, initialState } from './handle-event';

export const evaluationsForNotifications = {
  queries: {
    getPendingNotifications,
  },
  initialState,
  handleEvent: handleEvent(coarNotificationsConfig),
};

export { PendingNotification } from './handle-event';

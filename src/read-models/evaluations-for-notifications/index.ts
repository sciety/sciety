import { URL } from 'url';
import { getPendingNotifications } from './get-pending-notifications';
import { handleEvent, initialState } from './handle-event';
import * as GID from '../../types/group-id';

export const evaluationsForNotifications = {
  queries: {
    getPendingNotifications,
  },
  initialState,
  handleEvent: handleEvent(
    [GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7')],
    {
      id: new URL('https://coar-notify-inbox.fly.dev'),
      inbox: new URL('https://coar-notify-inbox.fly.dev/inbox/'),
    },
  ),
};

export { PendingNotification } from './handle-event';

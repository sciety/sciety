import { URL } from 'url';
import { getPendingNotifications } from './get-pending-notifications';
import { handleEvent, initialState } from './handle-event';
import * as GID from '../../types/group-id';

export const preReviewGroupId = GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7');
const biophysicsColabGroupId = GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');

const coarSandboxTarget = {
  id: 'https://coar-notify-inbox.fly.dev',
  inbox: new URL('https://coar-notify-inbox.fly.dev/inbox/'),
};

const biophysicsColabKotahiStagingTarget = {
  id: 'https://staging.kotahi.cloud/api/coar/inbox/kotahi',
  inbox: new URL('https://staging.kotahi.cloud/api/coar/inbox/kotahi'),
};

export const evaluationsForNotifications = {
  queries: {
    getPendingNotifications,
  },
  initialState,
  handleEvent: handleEvent(
    new Map([
      [preReviewGroupId, [coarSandboxTarget]],
      [biophysicsColabGroupId, [biophysicsColabKotahiStagingTarget]],
    ]),
  ),
};

export { PendingNotification } from './handle-event';

import { URL } from 'url';
import * as GID from '../../types/group-id';

export const preReviewGroupId = GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7');
const biophysicsColabGroupId = GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');

export type Target = {
  id: string,
  inbox: URL,
};

const coarSandboxTarget: Target = {
  id: 'https://coar-notify-inbox.fly.dev',
  inbox: new URL('https://coar-notify-inbox.fly.dev/inbox/'),
};

const biophysicsColabKotahiStagingTarget: Target = {
  id: 'https://staging.kotahi.cloud/api/coar/inbox/kotahi',
  inbox: new URL('https://staging.kotahi.cloud/api/coar/inbox/kotahi'),
};

export type CoarNotificationsConfig = ReadonlyMap<GID.GroupId, ReadonlyArray<Target>>;

export const coarNotificationsConfig: CoarNotificationsConfig = new Map([
  [preReviewGroupId, [coarSandboxTarget]],
  [biophysicsColabGroupId, [biophysicsColabKotahiStagingTarget]],
]);

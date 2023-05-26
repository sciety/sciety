import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { userIdCodec } from '../types/user-id';

export const userFollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  editorialCommunityId: GroupIdFromString,
});

export type UserFollowedEditorialCommunityEvent = t.TypeOf<typeof userFollowedEditorialCommunityEventCodec>;

export const isUserFollowedEditorialCommunityEvent = (event: { type: string }):
  event is UserFollowedEditorialCommunityEvent => event.type === 'UserFollowedEditorialCommunity';

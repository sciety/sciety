import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export const userFollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: UserIdFromString,
  editorialCommunityId: GroupIdFromString,
});

export type UserFollowedEditorialCommunityEvent = t.TypeOf<typeof userFollowedEditorialCommunityEventCodec>;

export const isUserFollowedEditorialCommunityEvent = userFollowedEditorialCommunityEventCodec.is;

export const userFollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
  date: Date = new Date(),
): UserFollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserFollowedEditorialCommunity',
  date,
  userId,
  editorialCommunityId,
});

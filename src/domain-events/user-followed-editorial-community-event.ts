import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';

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

import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';

export const userUnfollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  editorialCommunityId: GroupIdFromString,
});

type UserUnfollowedEditorialCommunityEvent = t.TypeOf<typeof userUnfollowedEditorialCommunityEventCodec>;

export const isUserUnfollowedEditorialCommunityEvent = (event: { type: string }):
  event is UserUnfollowedEditorialCommunityEvent => event.type === 'UserUnfollowedEditorialCommunity';

export const userUnfollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
): UserUnfollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserUnfollowedEditorialCommunity',
  date: new Date(),
  userId,
  editorialCommunityId,
});

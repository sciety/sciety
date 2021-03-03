import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { EventIdFromString } from '../../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';

const userFollowedEditorialCommunityDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    editorialCommunityId: GroupIdFromString,
  }),
});

const userUnfollowedEditorialCommunityDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    editorialCommunityId: GroupIdFromString,
  }),
});

export const databaseEvent = t.union([
  userFollowedEditorialCommunityDatabaseEvent,
  userUnfollowedEditorialCommunityDatabaseEvent,
]);

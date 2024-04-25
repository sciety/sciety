import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromStringCodec } from '../types/group-id';
import { userIdCodec } from '../types/user-id';

export const userFollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  editorialCommunityId: GroupIdFromStringCodec,
});

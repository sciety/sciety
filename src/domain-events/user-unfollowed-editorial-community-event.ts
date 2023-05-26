import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { userIdCodec } from '../types/user-id';

export const userUnfollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  editorialCommunityId: GroupIdFromString,
});

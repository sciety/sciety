import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString.js';
import { userIdCodec } from '../types/user-id.js';

export const userUnfollowedEditorialCommunityEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  editorialCommunityId: GroupIdFromString,
});

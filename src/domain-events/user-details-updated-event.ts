import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec } from '../types/user-id';

export const userDetailsUpdatedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('UserDetailsUpdated'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  avatarUrl: t.union([t.string, t.undefined]),
  displayName: t.union([t.string, t.undefined]),
});

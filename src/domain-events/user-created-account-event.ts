import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec } from '../types/user-id';
import { userHandleCodec } from '../types/user-handle';

export const userCreatedAccountEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserCreatedAccount'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  handle: userHandleCodec,
  avatarUrl: t.string,
  displayName: t.string,
});

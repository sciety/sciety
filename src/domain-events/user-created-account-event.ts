import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userHandleCodec } from '../types/user-handle';
import { userIdCodec } from '../types/user-id';

export const userCreatedAccountEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('UserCreatedAccount'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  handle: userHandleCodec,
  avatarUrl: t.string,
  displayName: t.string,
});

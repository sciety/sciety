import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';
import { UserHandle, userHandleCodec } from '../types/user-handle';

export const userCreatedAccountEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserCreatedAccount'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  handle: userHandleCodec,
  avatarUrl: t.string,
  displayName: t.string,
});

export type UserCreatedAccountEvent = t.TypeOf<typeof userCreatedAccountEventCodec>;

export const isUserCreatedAccountEvent = (event: { type: string }):
  event is UserCreatedAccountEvent => event.type === 'UserCreatedAccount';

export const userCreatedAccount = (
  userId: UserId,
  handle: UserHandle,
  avatarUrl: string,
  displayName: string,
  date: Date = new Date(),
): UserCreatedAccountEvent => ({
  id: generate(),
  type: 'UserCreatedAccount',
  date,
  userId,
  handle,
  avatarUrl,
  displayName,
});

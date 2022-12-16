import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { generate } from '../types/event-id';
import { UserId } from '../types/user-id';

export const userCreatedAccountEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserCreatedAccount'),
  date: tt.DateFromISOString,
  userId: UserIdFromString,
  handle: t.string,
  avatarUrl: t.string,
  displayName: t.string,
});

type UserCreatedAccountEvent = t.TypeOf<typeof userCreatedAccountEventCodec>;

export const isUserCreatedAccountEvent = (event: { type: string }):
  event is UserCreatedAccountEvent => event.type === 'UserCreatedAccount';

export const userCreatedAccount = (
  userId: UserId,
  handle: string,
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

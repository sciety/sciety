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

export type UserCreatedAccountEvent = t.TypeOf<typeof userCreatedAccountEventCodec>;

// ts-unused-exports:disable-next-line
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

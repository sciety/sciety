import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';

export const userDetailsUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserDetailsUpdated'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  avatarUrl: t.union([t.string, t.undefined]),
  displayName: t.union([t.string, t.undefined]),
});

export type UserDetailsUpdatedEvent = t.TypeOf<typeof userDetailsUpdatedEventCodec>;

export const isUserDetailsUpdatedEvent = (event: { type: string }):
  event is UserDetailsUpdatedEvent => event.type === 'UserDetailsUpdated';

export const userDetailsUpdated = (
  userId: UserId,
  avatarUrl?: string,
  displayName?: string,
  date: Date = new Date(),
): UserDetailsUpdatedEvent => ({
  id: generate(),
  type: 'UserDetailsUpdated',
  date,
  userId,
  avatarUrl,
  displayName,
});

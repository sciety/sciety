import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/Option';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec, UserId } from '../types/user-id';
import { generate } from '../types/event-id';

export const userDetailsUpdatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserDetailsUpdated'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  avatarUrl: tt.optionFromNullable(t.string),
  displayName: tt.optionFromNullable(t.string),
});

export type UserDetailsUpdatedEvent = t.TypeOf<typeof userDetailsUpdatedEventCodec>;

export const isUserDetailsUpdatedEvent = (event: { type: string }):
  event is UserDetailsUpdatedEvent => event.type === 'UserDetailsUpdated';

export const userDetailsUpdated = (
  userId: UserId,
  avatarUrl: O.Option<string>,
  displayName: O.Option<string>,
  date: Date = new Date(),
): UserDetailsUpdatedEvent => ({
  id: generate(),
  type: 'UserDetailsUpdated',
  date,
  userId,
  avatarUrl,
  displayName,
});

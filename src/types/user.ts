import * as t from 'io-ts';
import { UserIdFromString } from './codecs/UserIdFromString';
import { UserId } from './user-id';

export const userCodec = t.type({
  id: UserIdFromString,
  handle: t.string,
  avatarUrl: t.string,
});

export type User = {
  id: UserId,
  handle: string,
  avatarUrl: string,
};

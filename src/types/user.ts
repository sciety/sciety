import * as t from 'io-ts';
import { UserIdFromString } from './user-id';

const userCodec = t.type({
  id: UserIdFromString,
  handle: t.string,
  avatarUrl: t.string,
});

export type User = t.TypeOf<typeof userCodec>;

import * as t from 'io-ts';
import { UserIdFromString } from './codecs/UserIdFromString';

const userCodec = t.type({
  id: UserIdFromString,
  handle: t.string,
  avatarUrl: t.string,
});

export type User = t.TypeOf<typeof userCodec>;

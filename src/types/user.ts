import * as t from 'io-ts';
import { userIdCodec } from './user-id';

const userCodec = t.type({
  id: userIdCodec,
  handle: t.string,
  avatarUrl: t.string,
});

// ts-unused-exports:disable-next-line
export type User = t.TypeOf<typeof userCodec>;

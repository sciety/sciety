import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { userHandleCodec } from '../../types/user-handle';
import { userIdCodec } from '../../types/user-id';

export const createUserAccountCommandCodec = t.intersection([
  t.strict({
    userId: userIdCodec,
    handle: userHandleCodec,
    avatarUrl: t.string,
    displayName: t.string,
  }),
  t.partial({
    issuedAt: tt.DateFromISOString,
  }),
]);

export type CreateUserAccountCommand = t.TypeOf<typeof createUserAccountCommandCodec>;

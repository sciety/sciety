import * as t from 'io-ts';
import { userIdCodec } from '../../types/user-id';

export const updateUserDetailsCommandCodec = t.intersection([
  t.type({
    id: userIdCodec,
  }),
  t.partial({
    avatarUrl: t.string,
    displayName: t.string,
  }),
]);

export type UpdateUserDetailsCommand = t.TypeOf<typeof updateUserDetailsCommandCodec>;

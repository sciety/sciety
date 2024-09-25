import * as t from 'io-ts';
import { inputFieldNames } from '../../standards/input-field-names';
import { userHandleCodec } from '../../types/user-handle';
import { userIdCodec } from '../../types/user-id';

export const createUserAccountCommandCodec = t.strict({
  userId: userIdCodec,
  handle: userHandleCodec,
  [inputFieldNames.displayName]: t.string,
});

export type CreateUserAccountCommand = t.TypeOf<typeof createUserAccountCommandCodec>;
